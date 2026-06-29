export enum UserRole {
  DOCTOR = "doctor",
  PATIENT = "patient"
}

export enum AppointmentStatus {
  PENDING = "pending",     // Chờ xác nhận
  CONFIRMED = "confirmed", // Đã xác nhận
  DONE = "done",           // Đã hoàn thành
  CANCELLED = "cancelled"  // Đã hủy
}

export enum Specialty {
  GENERAL = "GENERAL",
  PEDIATRICS = "PEDIATRICS",
  CARDIOLOGY = "CARDIOLOGY",
  DERMATOLOGY = "DERMATOLOGY",
  DENTISTRY = "DENTISTRY"
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER"
}

export interface User {
  id?: string;
  email?: string;
  role?: UserRole;
  name?: string;
}

export interface UserRegister {
  email: string;
  password: string;
  name: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  experience: number; // số năm kinh nghiệm
  rating: number;
  avatar: string;
  email: string;
  phone: string;
}

export interface Patient {
  id: string;
  name: string;
  gender: Gender;
  dateOfBirth: string;
  phone: string;
  email: string;
}

export interface Appointment {
  id: number;
  patient_id: number;
  schedule_id: number;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
  schedule: {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: {
        id: number;
        name: string;
      }
    }
  },
  patient: {
    id: number;
    name: string;
    email: string;
    role: {
      id: number;
      name: string;
    }
  }
}

export interface Schedule {
  id: number;
  user_id: number;
  date: string;
  start_time: string;
  end_time: string;
  updated_at: string;
  user: {
    name: string;
    email: string;
    role: {
      id: number;
      name: string;
    }
  }
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

export interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  isBooked: boolean;
  resource: Schedule;
}
