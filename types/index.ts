export enum UserRole {
  DOCTOR = "doctor",
  PATIENT = "patient"
}

export enum AppointmentStatus {
  PENDING = "PENDING",     // Chờ xác nhận
  CONFIRMED = "CONFIRMED", // Đã xác nhận
  COMPLETED = "COMPLETED", // Đã hoàn thành
  CANCELLED = "CANCELLED"  // Đã hủy
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
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: Specialty;
  date: string; // YYYY-MM-DD
  timeSlot: string; // ví dụ: "08:00 - 09:00"
  status: AppointmentStatus;
  symptoms: string; // triệu chứng
  notes?: string; // ghi chú của bác sĩ
  scheduleId?: string;
}

export interface Schedule {
  id: number;
  user_id: number;
  date: string;
  start_time: string;
  end_time: string;
  updated_at: string;
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
