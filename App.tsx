
import React, { useState, useCallback } from 'react';
import { Student } from './types';

// Because jsPDF and autoTable are loaded from a CDN, we need to tell TypeScript about them.
declare const jspdf: any;

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: '', time: null },
  ]);
  const [nextId, setNextId] = useState<number>(2);

  const handleAddRow = useCallback(() => {
    setStudents((prevStudents) => [
      ...prevStudents,
      { id: nextId, name: '', time: null },
    ]);
    setNextId((prevId) => prevId + 1);
  }, [nextId]);

  const handleNameChange = useCallback((id: number, newName: string) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, name: newName } : student
      )
    );
  }, []);

  const handleRegisterTime = useCallback((id: number) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id
          ? { ...student, time: new Date().toLocaleTimeString('en-US') }
          : student
      )
    );
  }, []);

  const handleExportPdf = useCallback(() => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("INSTITUCION EDUCATIVA VALORES Y CIENCIAS", doc.internal.pageSize.getWidth() / 2, 22, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Registro de Entrega - 4to Examen TIPO ADMISION 2025", doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });
    doc.text("Primer Año de Secundaria", doc.internal.pageSize.getWidth() / 2, 36, { align: 'center' });


    const tableData = students
      .filter(s => s.name.trim() !== '' && s.time) // Only export completed rows
      .map((student, index) => [
      index + 1,
      student.name,
      student.time,
    ]);

    doc.autoTable({
      head: [['#', 'Nombre Completo', 'Hora de Entrega']],
      body: tableData,
      startY: 50,
      headStyles: {
        fillColor: [55, 143, 174] // Updated turquoise color for header (#378FAE)
      },
      styles: {
        halign: 'center'
      },
      columnStyles: {
        1: { halign: 'left' }
      }
    });

    doc.save('registro_examen_admision_2025.pdf');
  }, [students]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          <header className="text-center mb-8 border-b-2 border-[#378FAE] pb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              INSTITUCION EDUCATIVA VALORES Y CIENCIAS
            </h1>
            <p className="text-md md:text-lg text-gray-600 mt-2">
              4to Examen TIPO ADMISION 2025 - Primer Año de Secundaria
            </p>
          </header>
          
          <main>
            <div className="space-y-3">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 items-center px-4 py-2 font-semibold text-left text-gray-700 bg-gray-200 rounded-lg">
                  <div className="col-span-1">#</div>
                  <div className="col-span-6">Nombre Completo</div>
                  <div className="col-span-5">Registrar Hora</div>
              </div>

              {/* Student Rows */}
              {students.map((student, index) => (
                <div key={student.id} className="grid grid-cols-12 gap-4 items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="col-span-1 text-gray-600 font-semibold">{index + 1}</div>
                    <div className="col-span-11 md:col-span-6">
                        <input
                            type="text"
                            placeholder="Ingrese nombre completo del alumno"
                            value={student.name}
                            onChange={(e) => handleNameChange(student.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#378FAE] transition"
                            disabled={!!student.time}
                        />
                    </div>
                    <div className="col-span-11 col-start-2 md:col-start-auto md:col-span-5">
                        {student.time ? (
                            <div className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-800 rounded-md font-mono text-center">
                                {student.time}
                            </div>
                        ) : (
                            <button
                                onClick={() => handleRegisterTime(student.id)}
                                disabled={!student.name.trim()}
                                className="w-full flex items-center justify-center bg-[#378FAE] text-white font-bold py-2 px-4 rounded-md hover:bg-[#2c7ca8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#378FAE] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
                            >
                                <ClockIcon />
                                Registrar Hora
                            </button>
                        )}
                    </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={handleAddRow}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 border-2 border-dashed border-gray-400 text-gray-600 rounded-lg hover:bg-gray-200 hover:border-gray-500 transition-colors"
              >
                <PlusIcon />
                Agregar Fila
              </button>
              
              <button
                onClick={handleExportPdf}
                className="w-full sm:w-auto flex items-center justify-center bg-gray-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors"
              >
                <DownloadIcon />
                Generar PDF
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
