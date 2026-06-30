"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Doctor,
  Appointment,
  AppointmentStatus,
  Schedule,
  UserRole,
} from "../types";
import { useAuth } from "./AuthContext";

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

  const [doctors, setDoctors] = useState<Doctor[]>([]);
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
      user: {
        name: currentUser.name || "Bác sĩ",
        email: currentUser.email || "",
        role: {
          id: 1,
          name: UserRole.DOCTOR,
        },
      },
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
  ) => {
    if (!currentUser || !currentUser.id || !currentUser.name) return;

    const schedule = schedules.find(s => s.id === Number(scheduleId));
    if (!schedule) return;

    const newAppointment: Appointment = {
      id: Date.now(),
      patient_id: Number(currentUser.id),
      schedule_id: Number(scheduleId),
      status: AppointmentStatus.PENDING,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      schedule: {
        id: schedule.id,
        date: schedule.date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        user: {
          id: Number(doctorId),
          name: schedule.user?.name || "Bác sĩ Chuyên khoa",
          email: schedule.user?.email || "",
          role: {
            id: 1,
            name: UserRole.DOCTOR,
          },
        },
      },
      patient: {
        id: Number(currentUser.id),
        name: currentUser.name,
        email: currentUser.email || "",
        role: {
          id: 2,
          name: UserRole.PATIENT,
        },
      },
    };

    const updatedApts = [newAppointment, ...appointments];
    saveAppointments(updatedApts);
  };

  const updateAppointmentStatus = (
    appointmentId: string,
    status: AppointmentStatus,
  ) => {
    const updated = appointments.map(apt => {
      if (apt.id === Number(appointmentId)) {
        return {
          ...apt,
          status,
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
