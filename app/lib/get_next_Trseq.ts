import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getNextTranSeq(
  brnCd: number,
  trnDt: number
) {
  console.log('in gen seq');
  console.log(trnDt);
  console.log(brnCd);
  console.log('in gen seq');
  const result = await prisma.tran_seq_Mod.upsert({
    where: {
      brn_cd_trn_dt: {
        brn_cd: new Prisma.Decimal(brnCd),
        trn_dt: new Prisma.Decimal(trnDt),
      },
    },
    update: {
      trn_seq: {
        increment: new Prisma.Decimal(1),
      },
    },
    create: {
      brn_cd: new Prisma.Decimal(brnCd),
      trn_dt: new Prisma.Decimal(trnDt),
      trn_seq: new Prisma.Decimal(1),
    },
    select: {
      trn_seq: true,
    },
  });

  return Number(result.trn_seq);
}