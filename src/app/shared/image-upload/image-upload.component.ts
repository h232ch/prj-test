import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Board} from "../../board/board-models/board.model";
import {FormGroup} from "@angular/forms";

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent<T> implements OnInit {
    selectedFiles: File[];
    @Output() onSelectedFiles = new EventEmitter<File[]>();

    @Input() item: T;
    @Input() item_images: File[];

    @Output() onDeleteImages = new EventEmitter<File[]>();
    deletionImages = [];

    @Input() itemForm: FormGroup;
    @Input() itemData: string;
    constructor() {
    }

    ngOnInit(): void {

    }

    onFileSelected(event: Event) {
        const element = event.target as HTMLInputElement;
        if (element.files && element.files.length > 0) {
            this.selectedFiles = Array.from(element.files);
        } this.onSelectedFiles.emit(this.selectedFiles);
    }

    onDeleteImage(imageId: number) {
        const deletionImage = this.item_images[imageId];
        this.item_images.splice(imageId, 1);
        this.deletionImages.push(deletionImage);
        this.onDeleteImages.emit(this.deletionImages);
    }
}
