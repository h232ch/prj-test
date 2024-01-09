import {NgModule} from "@angular/core";
import {AlertComponent} from "./alert/alert.component";
import {DropdownDirective} from "./dropdown/dropdown.directive";
import {DropdownHeaderDirective} from "./dropdown/dropdown-header.directive";
import {PaginationComponent} from "./pagination/pagination.component";
import {LoadingSpinnerComponent} from "./loading-spinner/loading-spinner.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { ImageUploadComponent } from './image-upload/image-upload.component';

@NgModule({
  declarations: [
    AlertComponent,
    DropdownDirective,
    DropdownHeaderDirective,
    PaginationComponent,
    LoadingSpinnerComponent,
    ImageUploadComponent,
  ],
  exports: [
    AlertComponent,
    DropdownDirective,
    DropdownHeaderDirective,
    PaginationComponent,
    LoadingSpinnerComponent,
    ImageUploadComponent,

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
  ],
})
export class SharedModule {

}
