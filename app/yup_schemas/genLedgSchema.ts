import * as Yup from "yup";

export const genLedgSchema = Yup.object({
  gl_cd: Yup.number().required("GL Code is required"),
  gl_desc: Yup.string().required("Description is required"),
  gl_sdesc: Yup.string(),
  gl_cat: Yup.string().required("Category is required"),
  gl_type: Yup.string().required("Type is required"),
  yy_op_bal: Yup.number().required("Opening Balance required"),
  curr_bal: Yup.number().required("Current Balance required"),
  gl_stat: Yup.string().required("Status required"),
  inp_by: Yup.string().required(),
});
