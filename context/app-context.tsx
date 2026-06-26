"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  Doctor,
  Appointment,
  UserRole,
  AppointmentStatus,
  Specialty,
  Gender
} from "../types";

interface AppContextType {
  currentUser: User | null;
  doctors: Doctor[];
  appointments: Appointment[];
  login: (email: string, role: UserRole) => boolean;
  register: (name: string, email: string, phone: string, gender: Gender, dateOfBirth: string) => void;
  logout: () => void;
  bookAppointment: (doctorId: string, date: string, timeSlot: string, symptoms: string) => void;
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus, notes?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock doctors list
const MOCK_DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "BS. CKI Lê Mạnh Cường",
    specialty: Specialty.CARDIOLOGY,
    experience: 15,
    rating: 4.9,
    avatar: "https://picsum.photos/seed/doc-cuong/150/150",
    email: "cuong.le@clinic.com",
    phone: "0912345678"
  },
  {
    id: "doc-2",
    name: "ThS. BS Nguyễn Thị Mai",
    specialty: Specialty.PEDIATRICS,
    experience: 8,
    rating: 4.8,
    avatar: "https://picsum.photos/seed/doc-mai/150/150",
    email: "mai.nguyen@clinic.com",
    phone: "0987654321"
  },
  {
    id: "doc-3",
    name: "BS. CKI Trần Hữu Đạt",
    specialty: Specialty.DERMATOLOGY,
    experience: 12,
    rating: 4.7,
    avatar: "https://picsum.photos/seed/doc-dat/150/150",
    email: "dat.tran@clinic.com",
    phone: "0905556667"
  },
  {
    id: "doc-4",
    name: "Nha sĩ Phạm Thanh Hằng",
    specialty: Specialty.DENTISTRY,
    experience: 10,
    rating: 4.9,
    avatar: "https://picsum.photos/seed/doc-hang/150/150",
    email: "hang.pham@clinic.com",
    phone: "0933445566"
  },
  {
    id: "doc-5",
    name: "PGS. TS. BS Vũ Hoàng Nam",
    specialty: Specialty.GENERAL,
    experience: 22,
    rating: 5.0,
    avatar: "https://picsum.photos/seed/doc-nam/150/150",
    email: "nam.vu@clinic.com",
    phone: "0944556677"
  }
];

// Initial mock appointments
const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    patientId: "pat-1",
    patientName: "Trần Anh Tuấn",
    doctorId: "doc-1",
    doctorName: "BS. CKI Lê Mạnh Cường",
    specialty: Specialty.CARDIOLOGY,
    date: "2026-06-26",
    timeSlot: "09:00 - 10:00",
    status: AppointmentStatus.CONFIRMED,
    symptoms: "Thường xuyên bị đau tức ngực trái và khó thở khi vận động mạnh.",
  },
  {
    id: "apt-2",
    patientId: "pat-2",
    patientName: "Phạm Thùy Chi",
    doctorId: "doc-2",
    doctorName: "ThS. BS Nguyễn Thị Mai",
    specialty: Specialty.PEDIATRICS,
    date: "2026-06-26",
    timeSlot: "14:00 - 15:00",
    status: AppointmentStatus.PENDING,
    symptoms: "Bé bị sốt nhẹ kèm ho khan kéo dài 3 ngày nay.",
  },
  {
    id: "apt-3",
    patientId: "pat-1",
    patientName: "Trần Anh Tuấn",
    doctorId: "doc-3",
    doctorName: "BS. CKI Trần Hữu Đạt",
    specialty: Specialty.DERMATOLOGY,
    date: "2026-06-28",
    timeSlot: "10:00 - 11:00",
    status: AppointmentStatus.PENDING,
    symptoms: "Da tay nổi nhiều mụn nước nhỏ lắt nhắt và ngứa rát về đêm.",
  },
  {
    id: "apt-4",
    patientId: "pat-3",
    patientName: "Lê Hoàng Long",
    doctorId: "doc-5",
    doctorName: "PGS. TS. BS Vũ Hoàng Nam",
    specialty: Specialty.GENERAL,
    date: "2026-06-25",
    timeSlot: "08:30 - 09:30",
    status: AppointmentStatus.COMPLETED,
    symptoms: "Kiểm tra sức khỏe tổng quát định kỳ định kỳ 6 tháng.",
    notes: "Tất cả các chỉ số đều bình thường. Cần duy trì chế độ ăn nhạt và tập thể dục đều đặn."
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Load state from localStorage on mount (client side only)
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem("clinic_user");
      const savedApts = localStorage.getItem("clinic_appointments");

      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      if (savedApts) {
        setAppointments(JSON.parse(savedApts));
      } else {
        setAppointments(INITIAL_APPOINTMENTS);
        localStorage.setItem("clinic_appointments", JSON.stringify(INITIAL_APPOINTMENTS));
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save changes to localStorage
  const saveAppointments = (newApts: Appointment[]) => {
    setAppointments(newApts);
    localStorage.setItem("clinic_appointments", JSON.stringify(newApts));
  };

  const login = (email: string, role: UserRole): boolean => {
    // Để tiện demo, chúng ta mock đăng nhập
    let user: User | null = null;

    if (role === UserRole.DOCTOR) {
      const foundDoctor = MOCK_DOCTORS.find(doc => doc.email.toLowerCase() === email.toLowerCase());
      if (foundDoctor) {
        user = {
          id: foundDoctor.id,
          name: foundDoctor.name,
          email: foundDoctor.email,
          phone: foundDoctor.phone,
          role: UserRole.DOCTOR
        };
      } else {
        // Fallback tạo một bác sĩ tạm
        user = {
          id: "doc-temp",
          name: "Bác sĩ Demo",
          email: email,
          phone: "0900000000",
          role: UserRole.DOCTOR
        };
      }
    } else {
      // Patient login
      if (email.toLowerCase() === "tuan@gmail.com") {
        user = {
          id: "pat-1",
          name: "Trần Anh Tuấn",
          email: "tuan@gmail.com",
          phone: "0988777666",
          role: UserRole.PATIENT
        };
      } else {
        // Tạo bệnh nhân tạm
        user = {
          id: `pat-${Date.now()}`,
          name: email.split("@")[0],
          email: email,
          phone: "0999999999",
          role: UserRole.PATIENT
        };
      }
    }

    if (user) {
      setCurrentUser(user);
      localStorage.setItem("clinic_user", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const register = (
    name: string,
    email: string,
    phone: string,
  ) => {
    const newUser: User = {
      id: `pat-${Date.now()}`,
      name: name,
      email: email,
      phone: phone,
      role: UserRole.PATIENT
    };
    setCurrentUser(newUser);
    localStorage.setItem("clinic_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("clinic_user");
  };

  const bookAppointment = (
    doctorId: string,
    date: string,
    timeSlot: string,
    symptoms: string
  ) => {
    if (!currentUser || currentUser.role !== UserRole.PATIENT) return;

    const doctor = MOCK_DOCTORS.find(doc => doc.id === doctorId);
    if (!doctor) return;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: currentUser.id,
      patientName: currentUser.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
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
        currentUser,
        doctors: MOCK_DOCTORS,
        appointments,
        login,
        register,
        logout,
        bookAppointment,
        updateAppointmentStatus
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
