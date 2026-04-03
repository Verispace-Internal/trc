import {
  updateCompany,
  deleteCompany,
  getCompany
} from "../../../../controllers/companyController";

export async function PUT(req,{params}) {
  return updateCompany(req,{params});
}

export async function DELETE(req,{params}) {
  return deleteCompany(req,{params});
}

export async function GET(req,{params}) {
  return getCompany(req,{params});
}