import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { IconButton } from "./icon-button";
import { Table } from "./table/table";
import { TableHeader } from "./table/table-header";
import { TableCell } from "./table/table-cell";
import { TableRow } from "./table/table-row";
import { ChangeEvent, useEffect, useState } from "react";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AttendeeList {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  checkedInAt: string | null;
}
export function AttendeeList() {
  const [search, setSearch] = useState(() => {
    const url =  new URL(window.location.toString())
    if (url.searchParams.has('search')){
      return (url.searchParams.get('search')) ?? ''
    }
    return ''
  });
  const [page, setPage] = useState(()  => {
    const url =  new URL(window.location.toString())
    if (url.searchParams.has('page')){
      return Number(url.searchParams.get('page'))
    }
    return 1
  });
  const [total, setTotal] = useState(0);
  const [attendees, setAttendees] = useState<AttendeeList[]>([]);
  const totalPages = Math.ceil(total / 10);

  useEffect(() => {
    const url = new URL('http://localhost:8080/events/9e9bd979-9d10-4915-b339-3786b1634f33/attendees')
    url.searchParams.set('pageIndex', String(page -1))
    if (search.length > 0){
      url.searchParams.set('query', search)
    }
    
    const fetchData = async () => {
      fetch(url)
      .then(response => response.json())
      .then(data => {
        setAttendees(data.attendees)
        setTotal(data.total)
      })
    };
    fetchData();
  }, [page, search]);

  function setCurrentSearch(search: string) {
    const url =  new URL(window.location.toString())
      url.searchParams.set('search', search)
      window.history.pushState({}, "", url)
      setSearch(search)
  }
  function setCurrentPage(page: number){
      const url =  new URL(window.location.toString())
      url.searchParams.set('page', String(page))
      window.history.pushState({}, "", url)
      setPage(page)
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setCurrentSearch(e.target.value)
    setCurrentPage( 1 )
  }
  

  function handlePage(operation: string) {
    if (operation === "prev") {
      if (page === 1) {
        return;
      }
      setCurrentPage(page - 1 )
    } else if (operation === "next") {
      if (page === totalPages) {
        return;
      }
      setCurrentPage(page + 1 )
    } else if (operation === "first") {
      setCurrentPage( 1 )
    } else if (operation === "last") {
      setCurrentPage(totalPages)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div className="px-3 py-1.5 w-72 border border-white/10 rounded-lg text-sm flex items-center gap-3">
          <Search className="size-4 text-emerald-300" />
          <input
            value={search}
            onChange={handleInputChange}
            className="bg-transparent flex-1 outline-none h-auto border-0 p-0 text-sm ring-0 focus:ring-0"
            placeholder="Buscar participante..."
          ></input>
        </div>
      </div>
      <Table>
        <thead>
          <TableRow className="border-b border-white/10">
            <TableHeader style={{ width: 48 }}>
              <input
                className="size-4 bg-black/20 rounded border border-white/10 checked:bg-orange-400"
                type="checkbox"
              />
            </TableHeader>
            <TableHeader>Código</TableHeader>
            <TableHeader>Participante</TableHeader>
            <TableHeader>Data de incrição</TableHeader>
            <TableHeader>Data do check-in</TableHeader>
            <TableHeader style={{ width: 64 }}></TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {attendees.map((attendee) => {
            return (
              <TableRow key={attendee.id} className="border-b border-white/10">
                <TableCell>
                  <input
                    className="size-4 bg-black/20 rounded border border-white/10 accent-orange-400"
                    type="checkbox"
                  />
                </TableCell>
                <TableCell>{attendee.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white">
                      {attendee.name}
                    </span>
                    <span>{attendee.email}</span>
                  </div>
                </TableCell>

                <TableCell>
                  {formatDistanceToNow(attendee.createdAt, {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell>
                  {attendee.checkedInAt === null
                    ? <span className="text-zinc-400">"Não fez check-in"</span>
                    : formatDistanceToNow(attendee.checkedInAt, {
                        locale: ptBR,
                        addSuffix: true,
                      })}
                </TableCell>
                <TableCell>
                  <IconButton transparent>
                    <MoreHorizontal className="size-4 text-white" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </tbody>
        <tfoot>
          <TableRow>
            <TableCell colSpan={3}>
              Mostrando {attendees.length} de {total} itens
            </TableCell>
            <TableCell className="text-right" colSpan={3}>
              <div className="inline-flex items-center gap-8">
                <span>
                  Pagina {page} de {totalPages}
                </span>
                <div className="flex gap-1.5">
                  <IconButton
                    onClick={() => handlePage("first")}
                    disabled={page === 1}
                  >
                    <ChevronsLeft className="size-4 text-white" />
                  </IconButton>
                  <IconButton
                    onClick={() => handlePage("prev")}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="size-4 text-white" />
                  </IconButton>
                  <IconButton
                    onClick={() => handlePage("next")}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="size-4 text-white" />
                  </IconButton>
                  <IconButton
                    onClick={() => handlePage("last")}
                    disabled={page === totalPages}
                  >
                    <ChevronsRight className="size-4 text-white" />
                  </IconButton>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </tfoot>
      </Table>
    </div>
  );
}
