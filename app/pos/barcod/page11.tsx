import Barcode from "./barcomp";

{products.map((p, index) => (
  <div key={index} className="print-row">
    <span>{p.prd_cd}</span>

    <span className="desc">
      {p.prod_mast.prd_desc}
      <Barcode value={p.prod_mast.bar_cd} height={35} />
    </span>

    <span>{p.prd_qoh}</span>
    <span>{Number(p.pur_prc).toFixed(2)}</span>
    <span>{Number(p.max_rsp).toFixed(2)}</span>
  </div>
))}
