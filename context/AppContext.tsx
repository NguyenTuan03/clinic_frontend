"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Doctor,
  Appointment,
  AppointmentStatus,
  Specialty,
} from "../types";
import { useAuth } from "./AuthContext";
import { MOCK_DOCTORS } from "@/constants";

interface AppContextType {
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  bookAppointment: (doctorId: string, date: string, timeSlot: string, symptoms: string) => void;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus, notes?: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user: currentUser } = useAuth();

  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Load appointments from localStorage on mount (client side only)
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedApts = localStorage.getItem("clinic_appointments");
      if (savedApts) {
        try {
          setAppointments(JSON.parse(savedApts));
        } catch {
          setAppointments([]);
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save changes to localStorage
  const saveAppointments = (newApts: Appointment[]) => {
    setAppointments(newApts);
    localStorage.setItem("clinic_appointments", JSON.stringify(newApts));
  };

  const bookAppointment = (
    doctorId: string,
    date: string,
    timeSlot: string,
    symptoms: string
  ) => {
    if (!currentUser || !currentUser.id || !currentUser.name) return;

    const doctor = doctors.find(doc => doc.id === doctorId);
    const doctorName = doctor ? doctor.name : "Bác sĩ Chuyên khoa";
    const specialty = doctor ? doctor.specialty : Specialty.GENERAL;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: currentUser.id,
      patientName: currentUser.name,
      doctorId: doctorId,
      doctorName: doctorName,
      specialty: specialty,
      date: date,
      timeSlot: timeSlot,
      status: AppointmentStatus.PENDING,
      symptoms: symptoms
    };

    const updated = [newAppointment, ...appointments];
    saveAppointments(updated);
  };

  const updateAppointmentStatus = (
    appointmentId: string,
    status: AppointmentStatus,
    notes?: string
  ) => {
    const updated = appointments.map(apt => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          status,
          notes: notes !== undefined ? notes : apt.notes
        };
      }
      return apt;
    });
    saveAppointments(updated);
  };

  return (
    <AppContext.Provider
      value={{
        doctors,
        setDoctors,
        appointments,
        setAppointments,
        bookAppointment,
        updateAppointmentStatus,
        mobileMenuOpen,
        setMobileMenuOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
