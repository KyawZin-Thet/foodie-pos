import ItemCard from "@/components/ItemCards";
import NewTable from "@/components/NewTable";
import { useAppSelector } from "@/store/hook";
import TableBarIcon from "@mui/icons-material/TableBar";
import { Box, Button } from "@mui/material";
import { useState } from "react";

export default function Tables() {
  const [open, setOpen] = useState<boolean>(false);
  const tables = useAppSelector((store) => store.table.items);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          New Table
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {tables.map((table) => (
          <ItemCard
            icon={<TableBarIcon />}
            key={table.id}
            title={table.name}
            href={`/backoffice/tables/${table.id}`}
          />
        ))}
      </Box>
      <NewTable open={open} setOpen={setOpen} />
    </Box>
  );
}
