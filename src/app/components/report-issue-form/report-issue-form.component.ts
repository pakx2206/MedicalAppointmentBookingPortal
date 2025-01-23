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
  selectedFile: File | null = null;
  selectedFileBase64: string | null = null;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.issueForm = this.fb.group({
      issueType: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      priority: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      screenshotFile: [null], 
      agreeTerms: [false, Validators.requiredTrue],
    });    
  }

  ngOnInit(): void {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];

        const reader = new FileReader();
        reader.onload = () => {
            this.selectedFileBase64 = reader.result as string; 
        };
        reader.readAsDataURL(this.selectedFile);
    }
  }

  submitForm(): void {
    if (this.issueForm.invalid) {
        Object.keys(this.issueForm.controls).forEach(field => {
            const control = this.issueForm.get(field);
            control?.markAsTouched({ onlySelf: true });
        });
        return;
    }

    const newIssue = {
        id: Date.now(),
        issueType: this.issueForm.value.issueType,
        description: this.issueForm.value.description,
        priority: this.issueForm.value.priority,
        contactEmail: this.issueForm.value.contactEmail,
        screenshotFile: this.selectedFileBase64 || null,
    };

    let issues = JSON.parse(localStorage.getItem('issues') || '[]');
    issues.push(newIssue);
    localStorage.setItem('issues', JSON.stringify(issues));

    alert('✅ Zgłoszenie zostało wysłane!');
    this.issueForm.reset();
    this.selectedFile = null;
    this.selectedFileBase64 = null;
  }

  previewIssue(content: any): void {
    if (this.issueForm.valid) {
      this.previewData = this.issueForm.value;
      
      const modalRef = this.modalService.open(content, { 
        centered: true, 
        size: 'lg', 
        container: 'body', 
        backdrop: 'static' 
      });
  
      modalRef.result.catch(() => {});
    } else {
      alert('⚠️ Proszę poprawnie wypełnić formularz przed podglądem. ⚠️');
    }
  }
  
}
