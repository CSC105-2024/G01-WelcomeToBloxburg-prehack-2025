import { db } from "../index.ts";

export const createUser = async (data: {
  username: string;
  name: string;
  email: string;
  password: string;
  gender: string;
  age: number;
  img?: string;
}) => {
  const user = await db.user.create({
    data: {
      username: data.username,
      name: data.name,
      email: data.email,
      password: data.password,
      gender: data.gender,
      age: data.age,
      img: data.img,
    },
  });
  return user;
};

export const getAllUsers = async () => {
  const users = await db.user.findMany({
    include: {
      createdTrips: true,
      tripParticipants: true,
    },
  });
  return users;
};

export const getOneUser = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      id: id,
    },
    include: {
      createdTrips: true,
      tripParticipants: { include: { trip: {include : {createdBy : true}} } },
    },
  });
  return user;
};

export const editUser = async (
  id: string,
  data: {
    name?: string;
    gender?: string;
    age?: number;
    img?: string;
  }
) => {
  console.log(data.name, data.gender, data.age, data.img);

  const user = await db.user.update({
    where: {
      id: id,
    },
    data: {
      name: data.name,
      gender: data.gender,
      age: data.age,
      img: data.img,
    },
  });
  return user;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const user = await db.user.findUnique({
    where: {
      email: data.email,
      password: data.password,
    },
  });

  if (!user) throw new Error("Not match");
  return user;
};
