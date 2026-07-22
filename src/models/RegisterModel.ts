export interface RegisterForm {
  login: string
  user_name: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  role: string
  status: string
  bio: string
  profile_photo_path: string
  profile_photo_url: string
  id_card: string
  password: string
  password_confirme: string
  password_old: string
  phone_parent: string
  date_of_birth: string
  gender: string
  major: string
  level: string
  year: string
  address: string
  file: File | null
}
