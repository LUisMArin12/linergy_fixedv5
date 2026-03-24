import { useState } from 'react';
import { Download, CreditCard as Edit2, Check, X } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { generateFaultPDF, type FaultForReport } from '../../lib/reportUtils';

interface EditableReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  faultData: {
    lat: number | null;
    lon: number | null;
    hasValidCoords?: boolean;
    fallaId: string;
    lineaNumero: string;
    lineaNombre: string;
    km: number;
    tipo: string;
    fecha: string;
    hora: string;
    descripcion: string;
    estado: string;
  };
}

interface EditableFields {
  tipo: string;
  descripcion: string;
  km: number;
  lineaNombre: string;
}

export default function EditableReportPreviewModal({
  isOpen,
  onClose,
  faultData
}: EditableReportPreviewModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedFields, setEditedFields] = useState<EditableFields>({
    tipo: faultData.tipo,
    descripcion: faultData.descripcion,
    km: faultData.km,
    lineaNombre: faultData.lineaNombre,
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedFields({
      tipo: faultData.tipo,
      descripcion: faultData.descripcion,
      km: faultData.km,
      lineaNombre: faultData.lineaNombre,
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const normalizeEstadoToDbEnum = (
    estado: string
  ): 'ABIERTA' | 'EN_ATENCION' | 'CERRADA' => {
    if (estado === 'ABIERTA' || estado === 'EN_ATENCION' || estado === 'CERRADA') return estado;
    if (estado === 'Abierta') return 'ABIERTA';
    if (estado === 'En atención') return 'EN_ATENCION';
    if (estado === 'Cerrada') return 'CERRADA';
    return 'ABIERTA';
  };

  const handleExportPDF = () => {
    const hasValidCoords =
      typeof faultData.hasValidCoords === 'boolean'
        ? faultData.hasValidCoords
        : faultData.lat !== null && faultData.lon !== null;

    const falla: FaultForReport = {
      id: faultData.fallaId,
      ocurrencia_ts: new Date(`${faultData.fecha}T${faultData.hora}`).toISOString(),
      km: editedFields.km,
      tipo: editedFields.tipo,
      descripcion: editedFields.descripcion,
      estado: normalizeEstadoToDbEnum(faultData.estado),
      geom:
        hasValidCoords && faultData.lat !== null && faultData.lon !== null
          ? `POINT(${faultData.lon} ${faultData.lat})`
          : null,
    };

    const linea = {
      numero: faultData.lineaNumero,
      nombre: editedFields.lineaNombre,
    };

    generateFaultPDF(falla, linea);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vista Previa del Reporte" size="lg">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-[#111827]">Información del Reporte</h3>
          {!isEditing ? (
            <Button
              variant="secondary"
              icon={<Edit2 className="w-4 h-4" />}
              onClick={handleEdit}
              className="text-sm"
            >
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="primary"
                icon={<Check className="w-4 h-4" />}
                onClick={handleSave}
                className="text-sm"
              >
                Guardar
              </Button>
              <Button
                variant="secondary"
                icon={<X className="w-4 h-4" />}
                onClick={handleCancel}
                className="text-sm"
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                ID de Falla
              </label>
              <div className="text-sm font-mono text-[#111827] bg-[#F9FAFB] px-3 py-2 rounded">
                {faultData.fallaId}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                  Línea
                </label>
                <div className="text-sm text-[#111827] bg-[#F9FAFB] px-3 py-2 rounded">
                  {faultData.lineaNumero}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                  Nombre de Línea
                </label>
                {isEditing ? (
                  <Input
                    value={editedFields.lineaNombre}
                    onChange={(e) =>
                      setEditedFields({ ...editedFields, lineaNombre: e.target.value })
                    }
                  />
                ) : (
                  <div className="text-sm text-[#111827] bg-[#F9FAFB] px-3 py-2 rounded">
                    {editedFields.lineaNombre || 'N/A'}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                Kilómetro
              </label>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.001"
                  value={editedFields.km}
                  onChange={(e) =>
                    setEditedFields({ ...editedFields, km: parseFloat(e.target.value) || 0 })
                  }
                />
              ) : (
                <div className="text-sm text-[#111827] bg-[#F9FAFB] px-3 py-2 rounded">
                  {editedFields.km} km
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                Tipo de Falla
              </label>
              {isEditing ? (
                <Input
                  value={editedFields.tipo}
                  onChange={(e) =>
                    setEditedFields({ ...editedFields, tipo: e.target.value })
                  }
                />
              ) : (
                <div className="text-sm text-[#111827] bg-[#F9FAFB] px-3 py-2 rounded">
                  {editedFields.tipo}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                Descripción
              </label>
              {isEditing ? (
                <textarea
                  value={editedFields.descripcion}
                  onChange={(e) =>
                    setEditedFields({ ...editedFields, descripcion: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#157A5A] focus:border-transparent outline-none"
                  rows={3}
                />
              ) : (
                <div className="text-sm text-[#111827] bg-[#F9FAFB] px-3 py-2 rounded min-h-[60px]">
                  {editedFields.descripcion || 'Sin descripción adicional'}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                  Fecha
                </label>
                <div className="text-sm text-[#111827] bg-[#F9FAFB] px-3 py-2 rounded">
                  {new Date(faultData.fecha).toLocaleDateString('es-MX')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                  Hora
                </label>
                <div className="text-sm text-[#111827] bg-[#F9FAFB] px-3 py-2 rounded">
                  {faultData.hora}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                Estado
              </label>
              <div>
                <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                  {faultData.estado}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportPDF}
            className="w-full"
          >
            Generar PDF
          </Button>

          <Button variant="secondary" onClick={onClose} className="w-full">
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
