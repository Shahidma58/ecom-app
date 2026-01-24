import { Prisma } from "@prisma/client";

async function getNextTrnNo(
  prisma: Prisma.TransactionClient,
  brn_cd: number,
  trn_dt: number // YYYYMMDD
) {
  const seqRow = await prisma.tran_seq_Mod.upsert({
    where: {
      brn_cd_trn_dt: {
        brn_cd,
        trn_dt,
      },
    },
    update: {
      trn_seq: { increment: 1 },
    },
    create: {
      brn_cd,
      trn_dt,
      trn_seq: 1,
    },
  });

  return (
    brn_cd.toString() +
    trn_dt.toString() +
    seqRow.trn_seq.toString().padStart(6, "0")
  );
}
