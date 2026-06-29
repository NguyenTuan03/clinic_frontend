"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Doctor,
  Appointment,
  AppointmentStatus,
  Specialty,
  Schedule,
  UserRole,
} from "../types";
import { useAuth } from "./AuthContext";
import { MOCK_DOCTORS } from "@/constants";

interface AppContextType {
  doctors: Doctor[];
  setDoctors: React.Dispatch<React.SetStateAction<Doctor[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  schedules: Schedule[];
  addSchedule: (date: string, startTime: string, endTime: string) => void;
  deleteSchedule: (scheduleId: string) => void;
  bookAppointment: (doctorId: string, scheduleId: string, symptoms: string) => void;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus, notes?: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user: currentUser } = useAuth();

  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load data from localStorage on mount (client side only)
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

      const savedSchedules = localStorage.getItem("clinic_schedules");
      if (savedSchedules) {
        try {
          setSchedules(JSON.parse(savedSchedules));
        } catch {
          setSchedules([]);
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

  const addSchedule = (date: string, startTime: string, endTime: string) => {
    if (!currentUser || currentUser.role !== UserRole.DOCTOR || !currentUser.id) return;

    const newSchedule: Schedule = {
      id: Date.now(),
      user_id: Number(currentUser.id),
      date: date,
      start_time: startTime,
      end_time: endTime,
      updated_at: new Date().toISOString(),
    };

    const updated = [...schedules, newSchedule];
    setSchedules(updated);
    localStorage.setItem("clinic_schedules", JSON.stringify(updated));
  };

  const deleteSchedule = (scheduleId: string) => {
    const updated = schedules.filter(s => s.id !== Number(scheduleId));
    setSchedules(updated);
    localStorage.setItem("clinic_schedules", JSON.stringify(updated));
  };

  const bookAppointment = (
    doctorId: string,
    scheduleId: string,
    symptoms: string
  ) => {
    if (!currentUser || !currentUser.id || !currentUser.name) return;

    const schedule = schedules.find(s => s.id === Number(scheduleId));
    if (!schedule) return;

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
      date: schedule.date,
      timeSlot: `${schedule.start_time} - ${schedule.end_time}`,
      status: AppointmentStatus.PENDING,
      symptoms: symptoms,
      scheduleId: scheduleId,
    };

    const updatedApts = [newAppointment, ...appointments];
    saveAppointments(updatedApts);
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
          notes: notes !== undefined ? notes : apt.notes,
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
        schedules,
        addSchedule,
        deleteSchedule,
        bookAppointment,
        updateAppointmentStatus,
        mobileMenuOpen,
        setMobileMenuOpen,
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
