import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const { name, image } = await req.json();
    if (!currentUser?.id)
      return new NextResponse("Unauthorized", { status: 401 });
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image,
        name,
      },
    });
    return NextResponse.json(updatedUser);
  } catch (err: any) {
    console.log(err, `ERROR_SETTINGS`);
    return new NextResponse("Internal Error.", { status: 500 });
  }
}
