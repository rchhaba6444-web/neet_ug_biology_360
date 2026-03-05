# NEET UG Biology 360 🧬

A comprehensive educational e-commerce platform for NEET UG Biology preparation, offering digital and hardcopy study materials with modern UI/UX design.

## 🎯 Features

### 📚 Educational Content
- **NCERT Line-to-Line Notes** - Chapter-wise detailed biology notes
- **MCQ Chapter-wise Course** - 2100+ MCQs with explanations
- **Mock Test Series** - 20 full-length timed tests with auto-evaluation
- **NCERT Diagram-Based Booklet** - High-quality visual learning materials

### 💰 E-commerce Features
- Secure payment integration (PhonePe, Google Pay, UPI)
- Course pricing with discount offers
- Digital + hardcopy delivery options
- Order tracking and management

### 🔐 User System
- Email/Mobile authentication
- Student dashboard with progress tracking
- Purchase history and download management
- Performance analytics and reports

### 🤖 AI Chatbot
- Course guidance and recommendations
- Payment assistance
- Support and FAQ handling
- WhatsApp integration

### 📱 Modern UI/UX
- Responsive design (mobile-first)
- Smooth animations and transitions
- Dark/light theme support
- Accessibility features

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first styling
- **Vanilla JavaScript** - No framework dependencies
- **Font Awesome** - Icon library
- **AOS** - Scroll animations

### Backend
- **Firebase** - Authentication, Firestore, Storage
- **Firebase Hosting** - Deployment
- **Cloud Functions** - Server-side logic

### Payment Integration
- **PhonePe** - UPI payments
- **Google Pay** - UPI payments
- **Other UPI Apps** - Universal UPI support

## 📁 Project Structure

```
neet/
├── index.html              # Landing page
├── dashboard.html          # Student dashboard
├── mock-test.html          # Test interface
├── css/
│   └── styles.css          # Custom styles
├── js/
│   ├── firebase-config.js  # Firebase configuration
│   ├── auth.js            # Authentication system
│   ├── courses.js         # Course management
│   ├── dashboard.js       # Dashboard functionality
│   ├── mock-test.js       # Test engine
│   ├── chatbot.js         # AI chatbot
│   └── main.js            # Main application logic
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- Firebase account (for backend)
- Basic understanding of HTML/CSS/JavaScript

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/neet-biology-360.git
   cd neet-biology-360
   ```

2. **Set up Firebase**
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage
   - Update Firebase config in `js/firebase-config.js`

3. **Configure Firebase**
   ```javascript
   // In js/firebase-config.js
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

4. **Deploy to Firebase Hosting**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize hosting
   firebase init hosting
   
   # Deploy
   firebase deploy
   ```

5. **Local Development**
   - Simply open `index.html` in your browser
   - Or use a local server like Live Server extension in VS Code

## 📋 Key Features Implementation

### Authentication System
- Email/password signup and login
- User profile management
- Session persistence
- Password reset functionality

### Course Management
- Dynamic course loading
- Purchase tracking
- Progress monitoring
- Content protection

### Mock Test Engine
- Timer-based interface
- Question palette navigation
- Real-time progress tracking
- Automatic evaluation
- Performance analytics

### Payment Integration
- UPI payment gateway
- Transaction tracking
- Order management
- Receipt generation

### AI Chatbot
- Contextual responses
- Multi-category support
- WhatsApp redirection
- Analytics tracking

## 🎨 Design Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interface
- Adaptive layouts

### Animations
- Scroll-triggered animations (AOS)
- Hover effects and micro-interactions
- Loading states and transitions
- Progress indicators

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation
- Screen reader support

## 🔧 Customization

### Adding New Courses
1. Update course data in `js/courses.js`
2. Add course images to assets folder
3. Update pricing and features
4. Test purchase flow

### Modifying Test Questions
1. Update question generation in `js/mock-test.js`
2. Add real NEET questions
3. Set correct answers and explanations
4. Categorize by topic and difficulty

### Brand Customization
1. Update colors in `css/styles.css`
2. Replace logo and branding elements
3. Modify contact information
4. Update social media links

## 📊 Analytics and Monitoring

### Firebase Analytics
- User behavior tracking
- Course engagement metrics
- Test performance data
- Conversion funnel analysis

### Performance Monitoring
- Page load times
- User interaction tracking
- Error reporting
- A/B testing capabilities

## 🔒 Security Features

### Content Protection
- User authentication required
- Purchase verification
- Download restrictions
- Session management

### Data Security
- Firebase security rules
- Input validation
- XSS protection
- HTTPS enforcement

## 🚀 Deployment

### Firebase Hosting
```bash
firebase deploy --only hosting
```

### Custom Domain
1. Add custom domain in Firebase console
2. Update DNS records
3. Enable SSL certificate
4. Test domain propagation

## 📞 Support

### Contact Information
- Email: info@neetbiology360.com
- Phone: +91 9513102159
- WhatsApp: +91 9513102159
- WhatsApp Direct: https://wa.me/9513102159
- Email: kavirani576@gmail.com
- Address: Shardha Colony, Bangalore, Karnataka

### Documentation
- User guides and tutorials
- FAQ section
- Video demonstrations
- Technical support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- Tailwind CSS for styling framework
- Font Awesome for icons
- AOS for scroll animations
- NEET UG community for inspiration

## 📈 Roadmap

### Phase 1 (Current)
- ✅ Basic platform functionality
- ✅ Authentication system
- ✅ Course management
- ✅ Mock test engine
- ✅ Payment integration

### Phase 2 (Upcoming)
- 🔄 Advanced analytics dashboard
- 🔄 Video lecture integration
- 🔄 Live test sessions
- 🔄 Mobile app development
- 🔄 AI-powered recommendations

### Phase 3 (Future)
- 📋 Multi-language support
- 📋 Advanced personalization
- 📋 Community features
- 📋 Gamification elements
- 📋 Integration with schools

---

**NEET UG Biology 360** - Empowering students to achieve their medical dreams! 🎓🏥
