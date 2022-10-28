import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-delete-diagram-modal',
  templateUrl: './delete-diagram-modal.component.html',
  styleUrls: ['./delete-diagram-modal.component.scss']
})
export class DeleteDiagramModalComponent implements OnInit {
  isVisible = false;
  isConfirmLoading = false;

  @Output() confirmDeleteEmitter: EventEmitter<any> = new EventEmitter();
  @Input() selectedRow: any;
  constructor() { }
  ngOnInit(): void { }
  showModal(): void {
    this.isVisible = true;
  }

  handleOk(selectedRow: any): void {
    this.isConfirmLoading = true;
    setTimeout(() => {
      this.confirmDeleteEmitter.emit(selectedRow);
      this.isVisible = false;
      this.isConfirmLoading = false;
    }, 1000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
