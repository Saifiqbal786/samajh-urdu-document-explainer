/**
 * Built-in sample documents for instant testing without uploading files.
 */

export interface SampleDoc {
  id: string;
  title: string;
  titleUrdu: string;
  category: string;
  iconName: string;
  preview: string;
  text: string;
}

export const SAMPLE_DOCUMENTS: SampleDoc[] = [
  {
    id: 'lesco_bill',
    title: 'Electricity Bill',
    titleUrdu: 'بجلی کا بل (لیسکو)',
    category: 'utility_bill',
    iconName: 'Zap',
    preview: 'Units: 384 | Due: 14-Nov-2026 | Amount: Rs. 18,450',
    text: `LAHORE ELECTRIC SUPPLY COMPANY (LESCO)
ELECTRICITY CONSUMER BILL - OCTOBER 2026
Reference No: 08 11254 0987654 U
Consumer ID: 23891456
Consumer Name: MUHAMMAD USMAN S/O ABDUL MAJEED
Address: House No. 42-B, Sector D, Johar Town, Lahore
Tariff: A-1(01) GENERAL RESIDENTIAL - SINGLE PHASE
Sanctioned Load: 5 kW
Meter No: MTR-982314

Billing Month: OCT 2026
Issue Date: 02-NOV-2026
Reading Date: 28-OCT-2026
Current Reading: 18450
Previous Reading: 18066
Total Units Consumed: 384 Units

CHARGES BREAKDOWN:
Electricity Cost (384 units @ Slab Rate): Rs. 14,208.00
Fuel Price Adjustment (FPA) for Aug-2026: Rs. 1,689.60
Quartely Tariff Adjustment (QTA): Rs. 576.00
Electricity Duty (ED): Rs. 213.12
General Sales Tax (GST 18%): Rs. 1,463.28
TV License Fee: Rs. 35.00
Financing Cost Surcharge: Rs. 265.00

PAYABLE WITHIN DUE DATE: Rs. 18,450.00
DUE DATE: 14-NOV-2026

LATE PAYMENT SURCHARGE (L.P. Surcharge): Rs. 1,650.00
PAYABLE AFTER DUE DATE: Rs. 20,100.00

NOTICE TO CONSUMER:
1. Payment after due date will attract late payment surcharge automatically.
2. In case of non-payment of two consecutive bills, electricity supply will be disconnected without further notice under Section 24 of Electricity Act.
3. Pay conveniently through 1Link, EasyPaisa, JazzCash, ATMs or designated bank branches.`
  },
  {
    id: 'medical_rx',
    title: 'Prescription',
    titleUrdu: 'ڈاکٹر کا نسخہ (Rx)',
    category: 'prescription',
    iconName: 'Pill',
    preview: 'Dr. Farooq | Patient: Ali Raza | Antibiotics & Instructions',
    text: `SHIFA FAMILY CLINIC & CARE
Dr. Farooq Ahmed - MBBS, FCPS (Medicine)
Consultant Physician & Chest Specialist
PMDC Reg No: 48921-P
Clinic: 12-Commercial Area, Cavalry Ground, Lahore Cantt
Ph: 042-36654321

Patient Name: Ali Raza
Age: 42 Years / Male
Date: 26-Oct-2026
Weight: 74 kg
BP: 125/82 mmHg
Diagnosis: Acute Bronchitis & Upper Respiratory Infection (Fever 101F, productive cough x 4 days)

Rx (Medicines):
1. Tab. Augmentin 625mg (Co-Amoxiclav)
   Dosage: 1 tablet every 12 hours (Twice a day) for 7 days.
   Instructions: Take after meals. Complete full 7-day course even if symptoms subside.

2. Tab. Panadol Extra (Paracetamol 500mg + Caffeine 65mg)
   Dosage: 1 tablet 3 times a day (TDS) for 3 to 4 days.
   Instructions: Take only when fever or severe headache/body ache occurs. Do not exceed 6 tablets in 24 hours.

3. Syp. Acefyl Cough Syrup (Acefylline Piperazine)
   Dosage: 2 teaspoons (10ml) thrice daily for 5 days.
   Instructions: Take after meals with warm water.

4. Cap. Risek 20mg (Omeprazole)
   Dosage: 1 capsule daily in the morning 30 minutes before breakfast for 7 days.

Special Advice:
- Avoid cold water, fried food, and dust exposure.
- Gargle with warm salt water twice daily.
- If fever persists beyond 3 days or difficulty in breathing occurs, visit emergency immediately.
- Follow up in clinic on Saturday 02-Nov-2026.`
  },
  {
    id: 'court_notice',
    title: 'Court Notice',
    titleUrdu: 'عدالتی نوٹس / سمن',
    category: 'legal_notice',
    iconName: 'Scale',
    preview: 'Civil Court Rawalpindi | Suit No. 412/2026 | Appearance Date',
    text: `IN THE COURT OF SENIOR CIVIL JUDGE, RAWALPINDI
Summons to Defendant for Appearance and Written Statement
Under Order V, Rules 1 and 5, Code of Civil Procedure (Act V of 1908)

Civil Suit No: 412 / 2026
Title of Suit: Tariq Mahmood S/O Ghulam Sarwar
VERSUS
Muhammad Usman S/O Abdul Majeed, R/O House 19, Street 4, Satellite Town, Rawalpindi.

SUIT FOR DECLARATION AND PERMANENT INJUNCTION REGARDING PROPERTY PLOT NO. 88-K.

TO:
Muhammad Usman S/O Abdul Majeed
(Defendant above named)

WHEREAS the plaintiff has instituted a suit against you in this Court, you are hereby summoned and required to appear before this Court in person or by a pleader duly instructed and authorized on the 20th day of November, 2026 at 09:00 O'clock in the forenoon sharp to answer the claim.

You are further directed to produce on the said day all documents in your possession or power upon which you base your defence or intend to rely.

TAKE NOTICE that in default of your appearance on the day and time fixed above, the suit will be heard and determined in your absence EX-PARTE (یکطرفہ کارروائی) without any further intimation.

Given under my hand and the seal of this Court, this 24th day of October, 2026.

(Seal of the Court)
Senior Civil Judge, Rawalpindi`
  },
  {
    id: 'bank_dormancy',
    title: 'Bank Notice',
    titleUrdu: 'بینک اکاؤنٹ نوٹس',
    category: 'bank_letter',
    iconName: 'Landmark',
    preview: 'Habib Bank Ltd | Account Status: Inactive | Biometric Verification',
    text: `HABIB BANK LIMITED (HBL)
Branch: Mall Road, Lahore Branch (0145)
Date: 18-October-2026

Customer Name: Saira Bano
Account Number: 0145-7901234503
Mailing Address: Flat 4, Al-Madina Heights, Lahore

SUBJECT: IMPORTANT NOTICE - INOPERATIVE / DORMANT ACCOUNT STATUS

Dear Valued Customer,

We would like to bring to your kind attention that there has been no customer-initiated financial transaction (deposit or withdrawal) in your above-mentioned Savings Account for the past 11 consecutive months.

In accordance with State Bank of Pakistan (SBP) Prudential Regulations (BPRD Circular No. 02):
- Any bank account with no customer-initiated activity for 12 months is classified as "DORMANT / INACTIVE".
- Once marked dormant, debit transactions (withdrawals, ATM card, online fund transfers, cheque clearing) are temporarily suspended for your account's protection.

DEADLINE TO PREVENT DORMANCY: 15-November-2026

REQUIRED ACTION:
To keep your account active and prevent suspension:
1. Visit any HBL branch nationwide with your Original valid CNIC.
2. Complete Biometric Verification (BVS) on the biometric terminal.
3. Perform a nominal customer-initiated transaction (e.g. deposit or withdraw Rs. 500).

For assistance, please call our 24/7 Phone Banking at 021-111-111-425.

Sincerely,
Operations Manager
Habib Bank Limited`
  }
];
