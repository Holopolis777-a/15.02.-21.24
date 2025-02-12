export interface SalaryRequest {
  id: string;
  companyId: string;
  employeeId: string;
  status: 'Ausstehend' | 'Genehmigt' | 'Abgelehnt';
  amount: number;
  createdAt: string;
  updatedAt: string;
}
