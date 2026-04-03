import { addCompany, getCompanies } from "../../../controllers/companyController";

export async function POST(req) {
  return addCompany(req);
}

export async function GET(req) {
  return getCompanies(req);
}