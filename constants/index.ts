import { Doctor, Specialty } from "../types";

export const MOCK_DOCTORS: Doctor[] = [
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
