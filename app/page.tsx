"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Scissors, Palette, Users, Clock, Star } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function LucyScottHair() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FDF5EA] via-[#F8E5D6] to-[#CCA3A3] animate-gradient-shift"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-[#F8E5D6]/50 via-transparent to-[#FDF5EA]/30 animate-gradient-shift-reverse"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 w-full py-4 bg-white/80 backdrop-blur-sm border-b border-[#CCA3A3]/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/lucy-scott-wordmark.png"
                alt="Lucy Scott Hair"
                width={200}
                height={100}
                className="h-auto max-w-[150px] md:max-w-[200px]"
                priority
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-[#4E4A47] hover:text-[#CCA3A3] transition-colors font-light">
                About
              </a>
              <a href="#services" className="text-[#4E4A47] hover:text-[#CCA3A3] transition-colors font-light">
                Services & Pricing
              </a>
              <a href="#contact" className="text-[#4E4A47] hover:text-[#CCA3A3] transition-colors font-light">
                Contact
              </a>
              <Button
                size="sm"
                className="bg-[#FDF5EA] hover:bg-[#F8E5D6] text-[#4E4A47] px-6 py-2 text-sm font-light rounded-lg border border-[#CCA3A3]/20"
              >
                Book Now
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-[#4E4A47]"
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
            <div className="md:hidden mt-4 py-4 border-t border-[#CCA3A3]/20">
              <nav className="flex flex-col space-y-4">
                <a
                  href="#about"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#4E4A47] hover:text-[#CCA3A3] transition-colors font-light"
                >
                  About
                </a>
                <a
                  href="#services"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#4E4A47] hover:text-[#CCA3A3] transition-colors font-light"
                >
                  Services & Pricing
                </a>
                <a
                  href="#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#4E4A47] hover:text-[#CCA3A3] transition-colors font-light"
                >
                  Contact
                </a>
                <Button
                  size="sm"
                  className="bg-[#FDF5EA] hover:bg-[#F8E5D6] text-[#4E4A47] px-6 py-2 text-sm font-light rounded-lg border border-[#CCA3A3]/20 w-fit"
                >
                  Book Now
                </Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div
            className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <p className="text-lg font-light italic text-[#4E4A47] tracking-wide mb-8">Every Style, Every Story</p>

            <div className="w-full mb-12">
              <Image
                src="/lucy-scott-hair-wave.png"
                alt="Flowing hair design"
                width={1200}
                height={600}
                className="w-full h-auto max-w-6xl mx-auto"
              />
            </div>

            <p className="text-xl md:text-2xl text-[#4E4A47] max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Expert cuts, colour, and styling for all ages and genders in the heart of Flushing
            </p>

            <Button
              size="lg"
              className="bg-[#FDF5EA] hover:bg-[#F8E5D6] text-[#4E4A47] px-12 py-6 text-lg font-light tracking-wide rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-[#CCA3A3]/20"
            >
              Book Now
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl md:text-4xl font-black text-[#4E4A47] mb-8 tracking-wide">About Me</h3>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-[#CCA3A3]/20">
                <p className="text-lg text-[#4E4A47] leading-relaxed mb-8 font-light italic">
                  Lucy Scott is a local stylist and barber based in Flushing, offering expert cuts, colour, and styling
                  for all ages and genders. From classic trims to creative restyles, every appointment is tailored to
                  you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex flex-col items-center p-4">
                    <div className="w-16 h-16 bg-[#CCA3A3] rounded-full flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-[#4E4A47]" />
                    </div>
                    <h4 className="font-black text-[#4E4A47] mb-2">Inclusive</h4>
                    <p className="text-sm text-[#4E4A47] text-center font-light italic">All ages and genders welcome</p>
                  </div>

                  <div className="flex flex-col items-center p-4">
                    <div className="w-16 h-16 bg-[#CCA3A3] rounded-full flex items-center justify-center mb-4">
                      <Scissors className="w-8 h-8 text-[#4E4A47]" />
                    </div>
                    <h4 className="font-black text-[#4E4A47] mb-2">Tailored</h4>
                    <p className="text-sm text-[#4E4A47] text-center font-light italic">
                      Every appointment is personalized
                    </p>
                  </div>

                  <div className="flex flex-col items-center p-4">
                    <div className="w-16 h-16 bg-[#CCA3A3] rounded-full flex items-center justify-center mb-4">
                      <Clock className="w-8 h-8 text-[#4E4A47]" />
                    </div>
                    <h4 className="font-black text-[#4E4A47] mb-2">Appointment Only</h4>
                    <p className="text-sm text-[#4E4A47] text-center font-light italic">Dedicated time just for you</p>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="bg-[#F8E5D6] text-[#4E4A47] px-4 py-2 text-sm font-light border border-[#CCA3A3]/20"
                >
                  Friendly • Professional • Creative
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Pricing */}
      <section id="services" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-black text-[#4E4A47] mb-4 tracking-wide">Services & Pricing</h3>
              <p className="text-[#4E4A47] max-w-2xl mx-auto font-light italic">
                From classic cuts to creative transformations, every service is designed around you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="bg-white/60 backdrop-blur-sm border border-[#CCA3A3]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-lg">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-[#CCA3A3] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Scissors className="w-6 h-6 text-[#4E4A47]" />
                  </div>
                  <CardTitle className="text-xl font-black text-[#4E4A47]">Cut & Style</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#4E4A47] mb-4 font-light italic">
                    Expert cuts tailored to your face shape and lifestyle
                  </p>
                  <p className="text-2xl font-black text-[#4E4A47]">From £35</p>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border border-[#CCA3A3]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-lg">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-[#CCA3A3] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-6 h-6 text-[#4E4A47]" />
                  </div>
                  <CardTitle className="text-xl font-black text-[#4E4A47]">Colour Services</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#4E4A47] mb-4 font-light italic">
                    Full colour, highlights, balayage, and colour corrections
                  </p>
                  <p className="text-2xl font-black text-[#4E4A47]">From £55</p>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border border-[#CCA3A3]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-lg">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-[#CCA3A3] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-[#4E4A47]" />
                  </div>
                  <CardTitle className="text-xl font-black text-[#4E4A47]">Special Occasions</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#4E4A47] mb-4 font-light italic">
                    Wedding hair, prom styles, and special event looks
                  </p>
                  <p className="text-2xl font-black text-[#4E4A47]">From £45</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <p className="text-[#4E4A47] mb-6 font-light italic">
                Prices may vary based on hair length and complexity. Consultation included with every service.
              </p>
              <Button
                size="lg"
                variant="outline"
                className="border-[#4E4A47] text-[#4E4A47] hover:bg-[#FDF5EA] hover:text-[#4E4A47] px-8 py-4 rounded-lg transition-all duration-300 font-light"
              >
                View Full Price List
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-1000 delay-900 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-3xl md:text-4xl font-black text-[#4E4A47] mb-8 tracking-wide">Get In Touch</h3>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-[#CCA3A3]/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#CCA3A3] rounded-full flex items-center justify-center mb-4">
                      <Phone className="w-8 h-8 text-[#4E4A47]" />
                    </div>
                    <h4 className="font-black text-[#4E4A47] mb-2">Call</h4>
                    <a
                      href="tel:07817869728"
                      className="text-[#4E4A47] hover:text-[#CCA3A3] transition-colors font-light"
                    >
                      07817 869728
                    </a>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#CCA3A3] rounded-full flex items-center justify-center mb-4">
                      <Mail className="w-8 h-8 text-[#4E4A47]" />
                    </div>
                    <h4 className="font-black text-[#4E4A47] mb-2">Email</h4>
                    <a
                      href="mailto:bookings@lucyscotthair.co.uk"
                      className="text-[#4E4A47] hover:text-[#CCA3A3] transition-colors font-light"
                    >
                      bookings@lucyscotthair.co.uk
                    </a>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#CCA3A3] rounded-full flex items-center justify-center mb-4">
                      <MapPin className="w-8 h-8 text-[#4E4A47]" />
                    </div>
                    <h4 className="font-black text-[#4E4A47] mb-2">Location</h4>
                    <p className="text-[#4E4A47] font-light">Flushing</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="bg-[#FDF5EA] hover:bg-[#F8E5D6] text-[#4E4A47] px-12 py-6 text-lg font-light tracking-wide rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full md:w-auto border border-[#CCA3A3]/20"
                  >
                    Book Your Appointment
                  </Button>

                  <p className="text-sm text-[#4E4A47]/70 mt-4 font-light italic">
                    FRESHA booking integration coming soon for easy online scheduling
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
            <div className="text-[#4E4A47]">
              <p className="text-sm mb-2 font-light">
                © {new Date().getFullYear()} Lucy Scott Hair. All rights reserved.
              </p>
              <p className="text-xs font-light italic">Friendly • Inclusive • Appointment Only</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
