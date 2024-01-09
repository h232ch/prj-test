import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Comment} from "../../board-models/board.model";
import {ActivatedRoute, Params,} from "@angular/router";
import {CommentApiService} from "../comment-api-service";
import {Subject, Subscription} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
    selector: 'app-board-comment-edit',
    templateUrl: './board-comment-edit.component.html',
    styleUrls: ['./board-comment-edit.component.css']
})
export class BoardCommentEditComponent implements OnInit, OnDestroy {
    private commentApiServiceSub = new Subscription();

    @Input() commentEditMode = false;
    @Input() commentId: number;


    @Output() onEditModeChange = new EventEmitter<boolean>();
    @Output() onCommentIdChange = new EventEmitter<boolean>();

    @Input() childCommentMode = false;
    @Input() parentCommentId: number;

    @Output() onChildCommentModeChange = new EventEmitter<boolean>();
    @Output() onParentCommentIdChange = new EventEmitter<boolean>();


    boardId: number;

    // uploading images variables
    comment: Comment;
    commentForm: FormGroup;
    commentData = 'commentData';
    comment_images: File[];
    selectedFiles: File[];
    deletionImages: File[] = [];


    constructor(
        private commentApiService: CommentApiService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {

        this.route.params.pipe()
            .subscribe((params: Params) => {
                this.boardId = +params['id'];
                this.initForm();
            })

        this.commentApiServiceSub = this.commentApiService.comment
            // .pipe(takeUntil(this.destroy$))
            .subscribe(res => {
                this.comment = res;
                this.comment_images = res.comment_images as unknown as File[];
                this.commentForm.patchValue({
                    commentData: {
                        comment: res.comment,
                    }
                })
            })
    }

    private initForm() {
        this.commentForm = new FormGroup({
            commentData: new FormGroup({
                'comment': new FormControl<string>('',
                    [Validators.required]),
                'images': new FormControl<File>(null),
            })
        });

        if (this.commentId && !this.parentCommentId) {
            if (this.childCommentMode) {
                this.commentApiService.getById(this.commentId, this.childCommentMode);
            } else {
                this.commentApiService.getById(this.commentId);
            }
        }
    }

    onSubmit() {
        for (let deletionImage of this.deletionImages) {
            const imageId = deletionImage['id'];
            this.commentApiService.deleteImage(imageId, this.boardId);
        }
        this.deletionImages = [];

        const commentData = this.commentForm.value.commentData;
        const formData: FormData = this.onChangeComment(commentData);

        if (this.commentId) {
            // edit comment, child comment
            this.commentApiService.update(this.commentId, formData, this.boardId, this.childCommentMode);
        } else if (this.parentCommentId) {
            // new child comment
            this.commentApiService.create(formData, this.boardId, this.childCommentMode, this.parentCommentId);
        } else {
            // New comment
            this.commentApiService.create(formData, this.boardId);
        }
        this.init();
    }

    onChangeComment(commentData: Comment): FormData {
        const formData = new FormData();

        if (this.parentCommentId) {
            formData.append('p_comment', this.parentCommentId.toString());
        }
        if (this.selectedFiles) {
            for (const file of this.selectedFiles) {
                formData.append('images', file);
            }
        }
        if (this.commentId) {
            formData.append('board', this.boardId.toString());
            formData.append('comment', commentData.comment);
        } else {
            formData.append('board', this.boardId.toString());
            formData.append('comment', commentData.comment);
            formData.append('published', new Date().toISOString());
        }
        return formData;
    }

    onCancel() {
        this.init();
    }

    init() {
        this.commentForm.reset();
        this.commentEditMode = false;
        this.onEditModeChange.emit(this.commentEditMode);

        this.onCommentIdChange.emit(undefined);
        this.onChildCommentModeChange.emit(undefined);
        this.onParentCommentIdChange.emit(undefined);
    }

    ngOnDestroy(): void {
        this.commentApiServiceSub.unsubscribe();
    }

    onSelectedFiles(selectedFiles: File[]) {
        this.selectedFiles = selectedFiles;
    }

    onDeleteImage(deletionImages: File[]) {
        this.deletionImages = deletionImages;
    }

}
