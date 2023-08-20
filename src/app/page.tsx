'use client';

import React from 'react';

import Features from '@/components/Main/Features';
import Footer from '@/components/Main/Footer';
import Header from '@/components/Main/Header';
import Hero from '@/components/Main/Hero';
import Testimonials from '@/components/Main/Testimonials';

export default function MainPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
}
