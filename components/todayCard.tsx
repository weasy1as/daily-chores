import React from "react";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const TodayCard = () => {
  return (
    <Card className="p-6 flex flex-col justify-center ">
      <CardTitle>Today* tuesday, march 12</CardTitle>
      <CardContent className="flex gap-2">
        <Avatar className="">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-4">
          <h2>name</h2>
          <p>assigned for today</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 w-full">
        <div className="flex flex-col gap-4 w-full">
          <Button variant={"secondary"}>paid</Button>{" "}
          <Button variant={"secondary"}>paid</Button>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Button variant={"secondary"}>paid</Button>{" "}
          <Button variant={"secondary"}>paid</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TodayCard;
