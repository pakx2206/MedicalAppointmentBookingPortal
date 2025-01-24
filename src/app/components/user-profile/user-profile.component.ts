import { Component, NgModule, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-user-profile",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})

export class UserProfileComponent implements OnInit {
  currentUser: any = null;
  isAdmin: boolean = false;
  issues: any[] = [];
  selectedImage: string | null = null;

  ngOnInit() {
    this.loadCurrentUser();
    this.loadAllIssues();
  }

  loadCurrentUser(): void {
    if (typeof window !== "undefined" && window.localStorage) {
      this.currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      this.isAdmin = this.currentUser?.role === "admin"; 
    }
  }
  closeIssue(issueId: number): void {
    this.issues = this.issues.filter(issue => issue.id !== issueId); 
    localStorage.setItem('issues', JSON.stringify(this.issues)); 
    alert('✅ Zgłoszenie zostało zamknięte. ✅');
  }

  loadAllIssues(): void {
    if (this.isAdmin) {
      let storedIssues = localStorage.getItem("issues");
      if (storedIssues) {
        this.issues = JSON.parse(storedIssues);
      }
    }
  }
  loadIssues(): void {
    if (this.currentUser?.role === 'admin') {
        this.issues = JSON.parse(localStorage.getItem('issues') || '[]');
    }
  }
  resolveIssue(index: number): void {
    this.issues.splice(index, 1);
    localStorage.setItem("issues", JSON.stringify(this.issues));
  }
  openImage(imageSrc: string): void {
    this.selectedImage = imageSrc; 
  }

  closeImage(): void {
    this.selectedImage = null; 
  }
}
