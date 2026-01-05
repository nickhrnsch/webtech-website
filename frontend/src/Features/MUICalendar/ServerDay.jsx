import * as React from "react";
import Badge from "@mui/material/Badge";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { getDayBackgroundColor, getSeasonEmoji } from "./utils";

export default function ServerDay(props) {
  const {
    day,
    outsideCurrentMonth,
    onDayDoubleClick,
    notes = {},
    vacationDays = [],
    ...other
  } = props;

  const dayKey = day.format("YYYY-MM-DD");
  const hasNote =
    !outsideCurrentMonth && notes[dayKey] && notes[dayKey].trim() !== "";
  const vacation = !outsideCurrentMonth && vacationDays.find(v => v.days.includes(dayKey));
  const isVacation = !!vacation;

  const month = day.month() + 1; // dayjs months are 0-indexed
  const vacationEmoji = getSeasonEmoji(month);
  const bgColor = getDayBackgroundColor(day, dayKey, isVacation);

  const handleDoubleClick = () => {
    if (!outsideCurrentMonth) {
      onDayDoubleClick(day);
    }
  };

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isVacation ? vacationEmoji : hasNote ? "📝" : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        onDoubleClick={handleDoubleClick}
        sx={{
          backgroundColor: bgColor,
          "&:hover": {
            backgroundColor: bgColor,
            filter: "brightness(0.95)",
          },
        }}
      />
    </Badge>
  );
}
