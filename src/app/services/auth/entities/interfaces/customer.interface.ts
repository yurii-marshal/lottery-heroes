export interface CustomerInterface {
  address?: string;
  auth_id?: string;
  birth_date?: string;
  brand_id?: string;
  cid?: string;
  city?: string;
  country_id?: string;
  created_at?: string;
  criminal_check_status?: number;
  currency_id?: string;
  default_time_zone?;
  did_charge_back?: boolean;
  email?: string;
  first_name?: string;
  gender?;
  has_financial_fraud?: boolean;
  has_self_exclusion_history?: boolean;
  is_FTD?: boolean;
  is_known_terrorist?: boolean;
  is_politically_involved?: boolean;
  is_test?: boolean;
  kyc_status_id?: string;
  lang_id?: string;
  last_login?: string;
  last_name?: string;
  loyalty_level?;
  marketing_email_allowed?;
  mobile?;
  password?: string;
  password_reset_code?;
  persona_type_id?: string;
  phone?: string;
  state?;
  status_id?: string;
  updated_at?: string;
  zip?: string;
}
