/**
 * generate-w10-pdf.js — Creates W10_Capstone_Portfolio_TBI-26101076.pdf
 * Run: node generate-w10-pdf.js (from backend folder)
 */
require('dotenv').config();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'W10_Capstone_Portfolio_TBI-26101076.pdf');
const doc = new PDFDocument({ margin: 50, size: 'A4' });
doc.pipe(fs.createWriteStream(OUT));

const BROWN  = '#3e2410';
const AMBER  = '#c8845a';
const LIGHT  = '#fef9f4';
const GREEN  = '#2e7d32';
const RED    = '#c62828';
const GREY   = '#6b4c35';

function heading1(text) {
  doc.moveDown(0.5).fontSize(16).fillColor(BROWN).font('Helvetica-Bold').text(text).moveDown(0.3);
}
function heading2(text) {
  doc.moveDown(0.4).fontSize(12).fillColor(AMBER).font('Helvetica-Bold').text(text).moveDown(0.2);
}
function body(text, color = GREY) {
  doc.fontSize(9).fillColor(color).font('Helvetica').text(text, { lineGap: 3 });
}
function bullet(text) {
  doc.fontSize(9).fillColor(GREY).font('Helvetica').text(`  •  ${text}`, { lineGap: 2 });
}
function divider() {
  doc.moveDown(0.4).moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#e8d5bc').lineWidth(1).stroke().moveDown(0.4);
}
function codeBlock(text) {
  doc.moveDown(0.2)
    .rect(50, doc.y, 495, (text.split('\n').length * 11) + 10).fill('#f5ede0').fillColor('#f5ede0')
    .fillColor(BROWN).font('Courier').fontSize(7.5).text(text, 56, doc.y - (text.split('\n').length * 11) - 5, { lineGap: 2 })
    .moveDown(0.4);
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 1 — Title Page & Executive Portfolio Summary
// ─────────────────────────────────────────────────────────────────────────────
doc.rect(0, 0, 595, 842).fill('#3e2410');

doc.fillColor('#f5ede0').font('Helvetica-Bold').fontSize(26)
   .text('INN Sight AI', 50, 180, { align: 'center' });
doc.fillColor('#c8845a').font('Helvetica').fontSize(14)
   .text('Hotel & Homestay Review Intelligence Platform', { align: 'center' }).moveDown(0.5);
doc.fillColor('#f5ede0').fontSize(12)
   .text('Week 10 — Capstone & Final Portfolio Submission', { align: 'center' }).moveDown(2);

doc.fillColor('#c8845a').fontSize(11).font('Helvetica-Bold')
   .text('W10_Capstone_Portfolio_TBI-26101076', { align: 'center' }).moveDown(0.3);
doc.fillColor('#f5ede0').fontSize(10).font('Helvetica')
   .text('Intern ID: TBI-26101076', { align: 'center' })
   .text('Name: Mehak Sethi', { align: 'center' })
   .text('Institution: Graphic Era University (TBI)', { align: 'center' })
   .text('Date: 9 August 2026', { align: 'center' })
   .text('GitHub: https://github.com/mehaksethiii/Stay-INN_sight-AI', { align: 'center' })
   .text('Live App: https://stay-inn-sight-ai-f3ov.vercel.app', { align: 'center' });

doc.fillColor('#c8845a').fontSize(9).font('Helvetica')
   .text('Full-Stack React + Node.js/Express + MongoDB Atlas + Groq LLaMA 3.1 + HuggingFace', { align: 'center' }, 50, 690);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 2 — Final Project Architecture & Deliverables
// ─────────────────────────────────────────────────────────────────────────────
doc.addPage();

heading1('1. Capstone Project Overview & Problem Statement');
body('Modern hospitality managers and homestay hosts receive hundreds of unstructured feedback comments across multiple booking platforms (Airbnb, Booking.com, Google Reviews). Analyzing these manually leads to delayed operational interventions and lost guest revenue. INN Sight AI solves this through a real-time, multi-model AI intelligence engine.');

doc.moveDown(0.3);
heading2('2. Final Verified Deliverables Checklist');
bullet('Comprehensive README.md at repository root documenting full architecture, APIs, and setup.');
bullet('Live Vercel Frontend + Render Backend + MongoDB Atlas Cloud Database.');
bullet('Dual AI Review Intelligence Engine with 1-Sentence Executive Summaries.');
bullet('Real-Time Authenticated Management Dashboard with Search, Sentiment Filtering, and Full CRUD.');
bullet('Self-Assessment Form & Exit Survey completion summary.');

divider();

heading1('3. Core Technical Architecture & Fallback Engine');
codeBlock(
`[Incoming Review] ──> [Parallel Dispatcher]
                         ├──> Groq LLaMA 3.1 (Deep Reasoning & Executive Summary)
                         ├──> HuggingFace RoBERTa (Precision Emotion Analysis)
                         └──> Local Regex NLP Fallback (100% Offline Zero Downtime)
                                └──> Persistent Storage in MongoDB Atlas`
);

doc.moveDown(0.3);
heading2('4. Key Innovations Built in INN Sight AI');
bullet('Dual Model Consensus: Groq LLaMA 3.1 + HuggingFace RoBERTa inference running in parallel.');
bullet('Executive Review Summarizer: 1-sentence instant executive summaries for rapid manager triage.');
bullet('Figma Glass Action System: Glassmorphism action buttons for one-click review persistence.');
bullet('Signature Antigravity Cursor: HTML5 canvas stardust particle trail floating against gravity.');
bullet('Domain AI Assistant Chatbot: macOS-window styled assistant with hotel operations system prompt.');

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 3 — End-to-End User Flow & Verification
// ─────────────────────────────────────────────────────────────────────────────
doc.addPage();

heading1('5. End-to-End System Walkthrough');

heading2('5.1 Authentication Flow');
body('Supports secure JWT email/password authentication alongside Firebase Google OAuth for instant 1-click access. Tokens are verified via protected Express middleware.');

heading2('5.2 Management Dashboard Flow (CRUD)');
bullet('Create: Submit new guest reviews with automated real-time sentiment classification.');
bullet('Read: Multi-attribute live search and sentiment filter tags (Positive, Neutral, Negative).');
bullet('Update: Interactive Edit Modal allowing direct record refinement.');
bullet('Delete: Custom accessible ConfirmModal preventing accidental review deletions.');

heading2('5.3 AI Review Intelligence Flow');
body('Users enter or paste long reviews in a spacious multiline textarea. In under 1.5 seconds, the engine generates an Executive Summary, Sentiment confidence percentage, Emotion classification, detected theme pills (Cleanliness, Food, Staff, Location, Comfort, Value), operational recommendations, and an AI-drafted management reply.');

divider();

heading1('6. Deployment Architecture & Reliability');
codeBlock(
`Frontend Layer : Vercel (CI/CD automated deployment on push to main)
Backend Layer  : Express 5 on Render Web Services (Active /api/health keep-alive)
Database Layer : MongoDB Atlas Multi-Region Cloud Cluster
Inference APIs : Groq Cloud SDK + HuggingFace Inference API`
);

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 4 — Final Self-Assessment & Reflection
// ─────────────────────────────────────────────────────────────────────────────
doc.addPage();

heading1('7. Self-Assessment & 10-Week Learning Outcomes');

heading2('7.1 Technical Growth & Mastery');
bullet('Full-Stack Proficiency: Built production-ready React frontends, robust Express REST APIs, and MongoDB schemas.');
bullet('AI & LLM Integration: Mastered prompt engineering, multi-model fallback chains, and streaming chat sessions.');
bullet('UI/UX Polish: Implemented advanced micro-animations, glassmorphism design tokens, and custom particle cursors.');
bullet('DevOps & Cloud: Configured CI/CD pipelines on Vercel and Render with production environment variables.');

doc.moveDown(0.3);
heading2('7.2 Future Vision for INN Sight AI');
bullet('Direct OTA Channel Integration (Airbnb, TripAdvisor, Booking.com APIs).');
bullet('Multi-language real-time translation and dialect normalization.');
bullet('Multi-property manager hierarchy for enterprise hotel chains.');

divider();

heading1('8. Final Verification & Submission Statement');
body('All 10 weeks of internship milestones, from initial wireframing to full-stack implementation, AI integration, and production deployment, have been successfully executed, thoroughly verified, and documented.');

doc.moveDown(0.8);
doc.fillColor(BROWN).font('Helvetica-Bold').fontSize(10)
   .text('Submitted by: Mehak Sethi (TBI-26101076)  |  Graphic Era University TBI', { align: 'center' });

doc.end();
console.log('✅ W10 PDF created:', OUT);
