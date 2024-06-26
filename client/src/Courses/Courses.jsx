import { useCallback, useState, useEffect } from 'react';
import { useLocation, Link, Routes, Route } from 'react-router-dom';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Api from '../Api';
import Pagination from '../Components/Pagination';
import CourseTable from './CourseTable';
import CourseModal from './CourseModal';
import { DeleteModal } from '../Components';
import { Helmet } from 'react-helmet-async';

const columns = [
  {
    accessorKey: 'name',
    header: 'Course Name',
  },
];

const Courses = () => {
  const [data, setData] = useState();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const page = parseInt(params.get('page') ?? '1', 10);
  const [lastPage, setLastPage] = useState(1);

  const fetchData = useCallback(() => {
    Api.courses.index(page).then((response) => {
      setData(response.data);
      const linkHeader = Api.parseLinkHeader(response);
      let newLastPage = page;
      if (linkHeader?.last) {
        const match = linkHeader.last.match(/page=(\d+)/);
        newLastPage = parseInt(match[1], 10);
      } else if (linkHeader?.next) {
        newLastPage = page + 1;
      }
      setLastPage(newLastPage);
    });
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData, page]);

  const onCreate = () => {
    fetchData();
  };

  const onUpdate = (course) => {
    setData(data.map((c) => (c.id === course.id ? { ...course } : c)));
  };

  const onDelete = () => {
    fetchData();
  };

  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      data,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Helmet>
        <title>Courses</title>
      </Helmet>
      <main className="container">
        <div className="row align-items-start mt-5">
          <div className="col-3">
            <Link className="btn btn-primary" to={`new?page=${page}`}>
              <div className="d-flex align-items-center justify-content-center">
                New Courses
                <i className="bi bi-plus-lg" />
              </div>
            </Link>
          </div>
          <div className="col-6 text-center">
            <h1>Courses</h1>
          </div>
          <div className="col-3">
            <form className="d-flex" role="search">
              <div className="input-group">
                <span className="input-group-text" id="basic-addon1">
                  <i className="bi bi-search" />
                </span>
                <input type="search" className="form-control me-2" placeholder="Search Courses" />
              </div>
            </form>
          </div>
        </div>
        <CourseTable table={table} page={page} />
        <Pagination page={page} lastPage={lastPage} />
        <Routes>
          <Route path="new" element={<CourseModal onCreate={onCreate} page={page} />} />
          <Route path="edit/:courseId" element={<CourseModal onUpdate={onUpdate} page={page} />} />
          <Route path="delete/:id" element={<DeleteModal model="courses" onDelete={onDelete} page={page} />} />
        </Routes>
      </main>
    </>
  );
};

export default Courses;
