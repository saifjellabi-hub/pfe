import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router'; 
import { ThemeService } from '../theme';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  standalone: true, 
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
  host: {
      '[class.light-theme]': '!themeService.isDarkMode()'
    }
})
export class WelcomeComponent { 
  private cdr = inject(ChangeDetectorRef);
  themeService = inject(ThemeService);
  
  isChatOpen = false;
  userInput = '';
  
  // قائمة الرسائل الابتدائية
  messages = [
    { type: 'bot', text: 'Bonjour ! Je suis votre assistant CreditAI. Comment puis-je vous aider aujourd’hui ?' }
  ];

  // قائمة الاقتراحات الشاملة (حسب النقاط الـ 9 وموضوع الـ ML)
  allSuggestions = [
    "Quelles sont les conditions pour un prêt ?",
    "Quelles sont les conditions de crédit ?",
    "Comment est calculé le score ?",
    "Quels documents sont nécessaires ?",
    "Quels documents dois-je préparer ?",
    "Quels types de crédits proposez-vous ?",
    "Comment fonctionne le taux d'intérêt ?",
    "Quelles sont les garanties acceptées ?",
    "C'est quoi le modèle Decision Tree ?",
    "Pourquoi mon crédit peut être refusé ?",
    "Que se passe-t-il en cas de retard ?",
    "Quels sont mes droits en tant que client ?"
  ];

  filteredSuggestions: string[] = [];

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  // دالة لتصفية الاقتراحات عند الكتابة
  onInputChange() {
    const search = this.userInput.toLowerCase().trim();
    if (search.length > 1) {
      this.filteredSuggestions = this.allSuggestions.filter(s => 
        s.toLowerCase().includes(search)
      );
    } else {
      this.filteredSuggestions = [];
    }
  }

  // اختيار اقتراح من القائمة
  selectSuggestion(suggestion: string) {
    this.userInput = suggestion;
    this.filteredSuggestions = [];
    this.sendMessage();
  }

  async sendMessage() {
    const text = this.userInput.trim();
    if (!text) return;

    // 1. إضافة رسالة المستخدم
    this.messages = [...this.messages, { type: 'user', text: text }];
    this.userInput = '';
    this.filteredSuggestions = [];

    // 2. إضافة رسالة انتظار
    this.messages = [...this.messages, { type: 'bot', text: 'En cours de réflexion...' }];
    this.cdr.detectChanges();
    this.scrollToBottom();

    try {
      // 3. الاتصال بالـ Backend (Spring Boot)
      const res = await fetch('http://localhost:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text })
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      
      // 4. تعويض رسالة الانتظار بالرد الحقيقي
      this.messages.pop();
      this.messages = [...this.messages, { type: 'bot', text: data.reply }];

    } catch (e) {
      this.messages.pop();
      this.messages = [...this.messages, { type: 'bot', text: "Désolé, le service est indisponible pour le moment." }];
    } finally {
      this.cdr.detectChanges();
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatBody = document.querySelector('.chat-body');
      if (chatBody) {
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    }, 50);
  }
}



   
  
   
   