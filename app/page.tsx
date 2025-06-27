"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Scissors, Palette, Users, Clock, Star, Instagram, Send, Calendar, Printer, X, Share2, Map } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function LucyScottHair() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [showCookieBanner, setShowCookieBanner] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    // Clear form fields on page load/refresh
    const dateInput = document.getElementById('preferred-date') as HTMLInputElement;
    const timeInput = document.getElementById('preferred-time') as HTMLInputElement;
    if (dateInput) dateInput.value = '';
    if (timeInput) timeInput.value = '';
    
    // FORCE INJECT ANIMATIONS DIRECTLY INTO HEAD
    const style = document.createElement('style');
    style.textContent = `
      @keyframes gradientAnimation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes textShineAnimation {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      
      body {
        background: linear-gradient(-45deg, #FDF5EA, #F8E5D6, #FDF5EA, #F8E5D6) !important;
        background-size: 400% 400% !important;
        animation: gradientAnimation 15s ease infinite !important;
      }
      
      .hero-text-animated {
        background: linear-gradient(90deg, #4E4A47 0%, #FFF 25%, #CCA3A3 50%, #FFF 75%, #4E4A47 100%) !important;
        background-size: 400% 100% !important;
        color: transparent !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
        animation: textShineAnimation 8s ease-in-out infinite !important;
        display: inline-block !important;
        text-align: center !important;
      }
    `;
    document.head.appendChild(style);
  }, [])

  return (
    <div className="min-h-screen animated-gradient-bg m-0 p-0">
      {/* Pure CSS Gradient Background Animation - Full Viewport */}

      {/* Header - Sticky with Glass Effect - Higher padding for mobile */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full pt-12 pb-10 md:pt-5 md:pb-5 bg-transparent backdrop-blur-md border-b border-[#F8E5E8]/30 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo - Centered */}
            <div className="flex-shrink-0 absolute left-1/2 transform -translate-x-1/2">
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <Image
                  src="/lucy-scott-wordmark.png"
                  alt="Lucy Scott Hair"
                  width={200}
                  height={100}
                  className="h-auto max-w-[180px] md:max-w-[200px] cursor-pointer"
                  priority
                />
              </a>
            </div>

            {/* Desktop Navigation - Right aligned */}
            <nav className="hidden md:flex items-center space-x-8 ml-auto">
              <a href="#about" className="nav-font hover:text-[#D8A7B1] transition-colors">
                About
              </a>
              <a href="#services" className="nav-font hover:text-[#D8A7B1] transition-colors">
                Services & Pricing
              </a>
              <a href="#contact" className="nav-font hover:text-[#D8A7B1] transition-colors">
                Contact
              </a>
              <a 
                href="https://www.instagram.com/lucy_scott_hairbylucy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#4E4A47] hover:text-[#D8A7B1] transition-colors p-2"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <button className="lucy-button">
                Book Now
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[#333333] absolute right-4"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t border-[#F8E5E8]/30">
              <nav className="flex flex-col space-y-4">
                <a
                  href="#about"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#333333] hover:text-[#D8A7B1] transition-colors font-light"
                >
                  About
                </a>
                <a
                  href="#services"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#333333] hover:text-[#D8A7B1] transition-colors font-light"
                >
                  Services & Pricing
                </a>
                <a
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#333333] hover:text-[#D8A7B1] transition-colors font-light"
                >
                  Contact
                </a>
                <a 
                  href="https://www.instagram.com/lucy_scott_hairbylucy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#333333] hover:text-[#D8A7B1] transition-colors font-light flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </a>
                <button className="lucy-button text-sm px-6 py-2">
                  Book Now
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-48 md:pt-24 pb-12 md:pb-16">
        <div className="w-full">
          <div
            className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Full-width Hair Wave with Parallax Tagline Overlay */}
            <div className="relative w-full mb-12 -mx-4 md:-mx-8">
              <Image
                src="/lucy-scott-hair-wave.png"
                alt="Flowing hair design"
                width={1200}
                height={600}
                className="w-full h-auto opacity-80"
                priority
              />
              {/* Prominent Tagline Overlay - Moved up 30% */}
              <div className="absolute inset-0 flex flex-col items-center justify-center transform -translate-y-[30%]">
                <h1 className="heading-font text-4xl md:text-6xl lg:text-7xl font-bold tracking-wide text-center px-4 hero-text mb-4 hero-text-animated">
                  Every Style, Every Story
                </h1>
                <h2 className="body-font text-xl md:text-2xl text-[#4E4A47] text-center px-4 font-thin italic">
                  Where creativity meets craftsmanship
                </h2>
              </div>
            </div>

            <div className="container mx-auto text-center">
              <p className="text-xl md:text-2xl text-[#4E4A47] max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                Professional cuts, colour, and styling for all ages and genders in the heart of Flushing, Cornwall
              </p>

              <button className="lucy-button px-12 py-6 text-lg font-light tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 scroll-mt-20 md:scroll-mt-16">
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl md:text-4xl font-black text-[#4E4A47] mb-8 tracking-wide">About</h3>

              <div className="bg-white/70 backdrop-blur-sm rounded-[20px] p-8 md:p-12 shadow-lg border-4 border-[#E5D5C8]">
                {/* Circular Avatar Placeholder */}
                <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 bg-[#F8E5E8] rounded-full border-4 border-[#D8A7B1] shadow-lg flex items-center justify-center">
                  <svg className="w-12 h-12 md:w-16 md:h-16 text-[#4E4A47]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                
                <p className="text-lg text-[#4E4A47] leading-relaxed mb-6 font-light">
                  Nestled in the charming Village of Flushing, Cornwall, Lucy Scott Hair stands out for its welcoming and inclusive vibe, catering to all ages and genders. This environmentally conscious salon prides itself on offering personalised cutting, colouring, and styling services, ensuring each client feels valued and at ease. With a commitment to quality and a calm atmosphere, appointments are available on Tuesdays and Thursdays, so be sure to book in advance for the best experience.
                </p>
                
                <p className="text-base text-[#4E4A47] leading-relaxed mb-8 font-light italic">
                  Lucy Scott is a local stylist and barber based in Flushing, Cornwall, offering professional cuts, colour, and styling for all ages and genders. From classic trims to creative restyles, every appointment is tailored to you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex flex-col items-center p-4">
                    <div className="w-16 h-16 bg-[#D8A7B1] rounded-full flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-[#333333]" />
                    </div>
                    <h4 className="font-black text-[#333333] mb-2">Inclusive</h4>
                    <p className="text-sm text-[#333333] text-center font-light italic">All ages and genders welcome</p>
                  </div>

                  <div className="flex flex-col items-center p-4">
                    <div className="w-16 h-16 bg-[#D8A7B1] rounded-full flex items-center justify-center mb-4">
                      <Scissors className="w-8 h-8 text-[#333333]" />
                    </div>
                    <h4 className="font-black text-[#333333] mb-2">Tailored</h4>
                    <p className="text-sm text-[#333333] text-center font-light italic">
                      Every appointment is personalized
                    </p>
                  </div>

                  <div className="flex flex-col items-center p-4">
                    <div className="w-16 h-16 bg-[#D8A7B1] rounded-full flex items-center justify-center mb-4">
                      <Clock className="w-8 h-8 text-[#333333]" />
                    </div>
                    <h4 className="font-black text-[#333333] mb-2">Appointment Only</h4>
                    <p className="text-sm text-[#333333] text-center font-light italic">Dedicated time just for you</p>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="bg-[#F8E5E8] text-[#333333] px-4 py-2 text-sm font-light border border-[#C1A57B]/20"
                >
                  Friendly • Professional • Creative
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Pricing */}
      <section id="services" className="py-16 md:py-24 scroll-mt-20 md:scroll-mt-16">
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-black text-[#333333] mb-4 tracking-wide">Services & Pricing</h3>
              <p className="text-[#333333] max-w-2xl mx-auto font-light italic">
                From classic cuts to creative transformations, every service is designed around you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              <Card className="bg-white/[0.85] backdrop-blur-sm border-4 border-[#E5D5C8] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-[10px]">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-[#D8A7B1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Scissors className="w-6 h-6 text-[#4E4A47]" />
                  </div>
                  <CardTitle className="text-xl font-black text-[#4E4A47]">Cut & Style</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#4E4A47] mb-4 font-light italic">
                    Professional cuts tailored to your face shape and lifestyle
                  </p>
                  <p className="text-2xl font-black text-[#4E4A47]">From £25</p>
                </CardContent>
              </Card>

              <Card className="bg-white/[0.85] backdrop-blur-sm border-4 border-[#E5D5C8] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-[10px]">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-[#D8A7B1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-6 h-6 text-[#4E4A47]" />
                  </div>
                  <CardTitle className="text-xl font-black text-[#4E4A47]">Colour Services</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#4E4A47] mb-4 font-light italic">
                    Full colour, highlights, balayage, and colour corrections + free 15min consultation
                  </p>
                  <p className="text-2xl font-black text-[#4E4A47]">From £65</p>
                </CardContent>
              </Card>

              <Card className="bg-white/[0.85] backdrop-blur-sm border-4 border-[#E5D5C8] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-[10px]">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-[#D8A7B1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-[#4E4A47]" />
                  </div>
                  <CardTitle className="text-xl font-black text-[#4E4A47]">Men's Barbering</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#4E4A47] mb-4 font-light italic">
                    Traditional and modern barbering services
                  </p>
                  <p className="text-2xl font-black text-[#4E4A47]">From £25</p>
                </CardContent>
              </Card>

              <Card className="bg-white/[0.85] backdrop-blur-sm border-4 border-[#E5D5C8] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-[10px]">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-[#D8A7B1] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-[#4E4A47]" />
                  </div>
                  <CardTitle className="text-xl font-black text-[#4E4A47]">Children's Cuts</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#4E4A47] mb-4 font-light italic">
                    Gentle, patient cuts for little ones in a fun environment
                  </p>
                  <p className="text-2xl font-black text-[#4E4A47]">From £15</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <p className="text-[#333333] mb-6 font-light italic">
                Prices may vary based on hair length and complexity. Consultation included with every service.
              </p>
              <button 
                onClick={() => setShowPriceModal(true)}
                className="lucy-button px-8 py-4 font-light"
              >
                View Full Price List
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 scroll-mt-20 md:scroll-mt-16">
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 delay-900 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl md:text-4xl font-black text-[#333333] mb-8 tracking-wide">Get In Touch</h3>

              {/* Contact Form */}
              <div className="bg-white/70 backdrop-blur-sm rounded-[10px] p-8 md:p-12 shadow-lg border-4 border-[#E5D5C8] mb-8">
                <h4 className="text-2xl font-black text-[#4E4A47] mb-4 text-center">Send us an Enquiry</h4>
                <p className="text-center text-[#4E4A47] mb-6 font-light italic">
                  Appointments are available by booking only. Our salon operates on Tuesdays and Thursdays, with flexible scheduling to accommodate your needs. Please contact us to discuss your requirements and check availability.
                </p>
                {/* Hidden form for Netlify form detection */}
                <form 
                  name="contact" 
                  method="POST" 
                  data-netlify="true"
                  hidden
                >
                  <input type="text" name="name" />
                  <input type="tel" name="contact-number" />
                  <input type="date" name="preferred-date" />
                  <input type="time" name="preferred-time" />
                  <textarea name="enquiry"></textarea>
                </form>
                
                {/* Actual form that users interact with */}
                <form 
                  name="contact" 
                  method="POST" 
                  action="/contact-success"
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    formData.append('form-name', 'contact');
                    
                    fetch('/', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                      body: new URLSearchParams(formData as any).toString()
                    })
                    .then(() => {
                      alert('Thank you for your enquiry! We\'ll get back to you soon.');
                      form.reset();
                      // Ensure date and time fields are completely cleared
                      const dateInput = form.querySelector('#preferred-date') as HTMLInputElement;
                      const timeInput = form.querySelector('#preferred-time') as HTMLInputElement;
                      if (dateInput) dateInput.value = '';
                      if (timeInput) timeInput.value = '';
                    })
                    .catch((error) => {
                      alert('Sorry, there was an error sending your message. Please try again or contact us directly.');
                      console.error('Form submission error:', error);
                    });
                  }}
                >
                  <input type="hidden" name="form-name" value="contact" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label htmlFor="name" className="text-left block text-sm font-black text-[#4E4A47] mb-2">
                      Name *
                    </label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full border-2 border-[#F8E5E8] focus:border-[#D8A7B1] rounded-[12px]"
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                    <label htmlFor="contact-number" className="text-left block text-sm font-black text-[#4E4A47] mb-2">
                      Contact Number *
                    </label>
                      <Input
                        type="tel"
                        id="contact-number"
                        name="contact-number"
                        required
                        className="w-full border-2 border-[#F8E5E8] focus:border-[#D8A7B1] rounded-[12px]"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label htmlFor="preferred-date" className="text-left block text-sm font-black text-[#4E4A47] mb-2">
                      Preferred Appointment Date
                    </label>
                      <Input
                        type="date"
                        id="preferred-date"
                        name="preferred-date"
                        className="w-full border-2 border-[#F8E5E8] focus:border-[#D8A7B1] rounded-[12px]"
                      />
                    </div>
                    
                    <div>
                    <label htmlFor="preferred-time" className="text-left block text-sm font-black text-[#4E4A47] mb-2">
                      Preferred Appointment Time
                    </label>
                      <Input
                        type="time"
                        id="preferred-time"
                        name="preferred-time"
                        min="09:00"
                        max="17:00"
                        step="900"
                        className="w-full border-2 border-[#F8E5E8] focus:border-[#D8A7B1] rounded-[12px]"
                        placeholder="Select time"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="enquiry" className="text-left block text-sm font-black text-[#4E4A47] mb-2">
                      Enquiry *
                    </label>
                    <Textarea
                      id="enquiry"
                      name="enquiry"
                      required
                      rows={4}
                      className="w-full border-2 border-[#F8E5E8] focus:border-[#D8A7B1] rounded-[12px]"
                      placeholder="Tell us about your hair goals, preferred appointment times, or any questions you have..."
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="lucy-button w-64 px-8 py-3 font-light flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Enquiry
                    </button>
                  </div>
                </form>
              </div>

              {/* Contact Information */}
              <div className="bg-white/70 backdrop-blur-sm rounded-[20px] p-8 md:p-12 shadow-lg border-4 border-[#E5D5C8]">
                <h4 className="text-2xl font-black text-[#333333] mb-6 text-center">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#D8A7B1] rounded-full flex items-center justify-center mb-4">
                      <Phone className="w-8 h-8 text-[#333333]" />
                    </div>
                    <h4 className="font-black text-[#333333] mb-2">Call</h4>
                    <a
                      href="tel:07817869728"
                      className="text-[#333333] hover:text-[#D8A7B1] transition-colors font-light"
                    >
                      07817 869728
                    </a>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#D8A7B1] rounded-full flex items-center justify-center mb-4">
                      <Mail className="w-8 h-8 text-[#333333]" />
                    </div>
                    <h4 className="font-black text-[#333333] mb-2">Email</h4>
                    <a
                      href="mailto:bookings@lucyscotthair.co.uk"
                      className="text-[#333333] hover:text-[#D8A7B1] transition-colors font-light"
                    >
                      bookings@lucyscotthair.co.uk
                    </a>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#D8A7B1] rounded-full flex items-center justify-center mb-4">
                      <MapPin className="w-8 h-8 text-[#333333]" />
                    </div>
                    <h4 className="font-black text-[#333333] mb-2">Location</h4>
                    <p className="text-[#333333] font-light mb-2">Flushing Village Club</p>
                    <p className="text-xs text-[#333333] font-light mb-3">Coventry Road, Flushing, Cornwall, TR11 5TY</p>
                    <button 
                      onClick={() => setShowMapModal(true)}
                      className="inline-flex items-center gap-2 text-[#D8A7B1] hover:text-[#4E4A47] transition-colors text-sm font-medium"
                    >
                      <Map className="w-4 h-4" />
                      See map
                    </button>
                  </div>
                </div>

                <div className="space-y-4 text-center">
                  <button className="lucy-button px-12 py-6 text-lg font-light tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto">
                    <Calendar className="w-5 h-5" />
                    Availability
                  </button>

                  <p className="text-sm text-[#4E4A47]/70 mt-4 font-light italic">
                    Coming soon: Gift cards, memberships, and our full product range available for online purchase
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 delay-1100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="text-[#333333]">
              <p className="text-sm mb-2 font-light">
                © {new Date().getFullYear()} Lucy Scott Hair. All rights reserved.
              </p>
              <p className="text-xs font-light italic">Friendly • Inclusive • Appointment Only</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Price List Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[20px] max-w-4xl max-h-[90vh] overflow-hidden relative">
            {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-[#F8E5E8] bg-[#FDF5EA]">
                <h3 className="text-2xl font-black text-[#4E4A47]">Price List</h3>
                <div className="flex items-center gap-6 pr-10">
                  <button
                    onClick={() => {
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`
                        <html>
                          <head><title>Lucy Scott Hair - Price List</title></head>
                          <body style="margin:0; padding:20px;">
                            <img src="/LucyScott_Hair_Concept-10-LUCY SCOTT - Price List-2.png" style="max-width:100%; height:auto;" />
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }}
                    className="w-10 h-10 rounded-full border-2 border-[#E5D5C8] flex items-center justify-center hover:bg-[#F8E5E8] transition-colors"
                    title="Print"
                  >
                    <Printer className="w-4 h-4 text-[#E5D5C8]" strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => {
                      const imageUrl = `${window.location.origin}/LucyScott_Hair_Concept-10-LUCY%20SCOTT%20-%20Price%20List-2.png`;
                      if (navigator.share) {
                        navigator.share({
                          title: 'Lucy Scott Hair - Price List',
                          text: 'Check out our current prices for professional hair cutting, colouring, and styling services.',
                          url: imageUrl
                        });
                      } else {
                        navigator.clipboard.writeText(imageUrl);
                        alert('Price list image link copied to clipboard!');
                      }
                    }}
                    className="w-10 h-10 rounded-full border-2 border-[#E5D5C8] flex items-center justify-center hover:bg-[#F8E5E8] transition-colors"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4 text-[#E5D5C8]" strokeWidth={2} />
                  </button>
                </div>
              </div>
            
            {/* Close Button - Top Right */}
            <button
              onClick={() => setShowPriceModal(false)}
              className="absolute top-4 right-4 p-2 text-[#4E4A47] hover:text-[#D8A7B1] hover:bg-[#F8E5E8] rounded-full transition-colors z-10"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[70vh] printable-area">
              <Image
                src="/LucyScott_Hair_Concept-10-LUCY SCOTT - Price List-2.png"
                alt="Lucy Scott Hair Price List"
                width={800}
                height={1000}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[20px] max-w-4xl max-h-[90vh] overflow-hidden relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-[#F8E5E8] bg-[#FDF5EA]">
              <h3 className="text-2xl font-black text-[#4E4A47]">Location</h3>
            </div>
            
            {/* Close Button - Top Right */}
            <button
              onClick={() => setShowMapModal(false)}
              className="absolute top-4 right-4 p-2 text-[#4E4A47] hover:text-[#D8A7B1] hover:bg-[#F8E5E8] rounded-full transition-colors z-10"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-black text-[#4E4A47] mb-2">Flushing Village Club</h4>
                <p className="text-[#333333] text-sm">Coventry Road, Flushing, Cornwall, TR11 5TY</p>
              </div>
              <div className="w-full h-[450px] rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d638.9612428028489!2d-5.070917330291101!3d50.16403595732194!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x486b3d32734367bb%3A0x7f64b1a9d60aca64!2sFlushing%20Village%20Club!5e0!3m2!1sen!2suk!4v1751034258844!5m2!1sen!2suk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Flushing Village Club Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-[90] bg-[#FDF5EA] border-t border-[#4E4A47]/20 p-4 shadow-lg">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-[#4E4A47] text-sm flex-1">
                <p>
                  We use essential cookies to ensure our website works properly. By continuing to use this site, you agree to our use of cookies.
                  <a href="#" className="underline hover:text-[#D8A7B1] ml-1">Learn more</a>
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCookieBanner(false)}
                  className="bg-[#4E4A47] text-[#FDF5EA] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#333333] transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => setShowCookieBanner(false)}
                  className="text-[#4E4A47] px-4 py-2 text-sm hover:text-[#D8A7B1] transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
