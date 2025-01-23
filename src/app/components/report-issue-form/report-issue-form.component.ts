import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 

@Component({
  selector: 'app-report-issue-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './report-issue-form.component.html',
  styleUrls: ['./report-issue-form.component.scss']
})
export class ReportIssueFormComponent implements OnInit {
  issueForm: FormGroup;
  previewData: any = null;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.issueForm = this.fb.group({
      issueType: ['', Validators.required], 
      description: ['', [Validators.required, Validators.minLength(10)]], 
      priority: ['', Validators.required], 
      screenshotFile: [null], 
      contactEmail: ['', [Validators.required, Validators.email]], 
      agreeTerms: [false, Validators.requiredTrue] 
    });
  }

  ngOnInit(): void {}
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.issueForm.patchValue({ screenshotFile: file });
      this.issueForm.get('screenshotFile')?.updateValueAndValidity();
    }
  }  
  submitForm(): void {
    if (this.issueForm.valid) {
      alert('✅ Zgłoszenie zostało wysłane!');
      this.issueForm.reset();
    } else {
      alert('⚠️ Proszę poprawnie wypełnić formularz.');
    }
  }

  previewIssue(content: any): void {
    if (this.issueForm.valid) {
      this.previewData = this.issueForm.value;
      
      const modalRef = this.modalService.open(content, { centered: true, size: 'lg' });
      
      modalRef.result.catch(() => {});
    } else {
      alert('⚠️ Proszę poprawnie wypełnić formularz przed podglądem.');
    }
  }  
}
