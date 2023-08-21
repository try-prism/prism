'use client';

import React from 'react';

import RegisterDemo from '@/components/Contact/RegisterDemo';
import Header from '@/components/Main/Header';

export default function Contact() {
  return (
    <div className="min-h-screen">
      <Header />
      <RegisterDemo />
    </div>
  );
}
