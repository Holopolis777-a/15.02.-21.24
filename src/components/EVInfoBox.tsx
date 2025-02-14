import React from "react"
import { motion } from "framer-motion"
import { Battery, Zap } from "lucide-react"
import { Vehicle } from "../types/vehicle"

const InfoBox = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="p-6">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-lg font-semibold ml-2">{title}</h3>
    </div>
    {children}
  </div>
)

const InfoItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-gray-600 text-sm">{label}</span>
    <span className="font-medium text-gray-900">{value}</span>
  </div>
)

const ChargingSpeedBar = ({
  label,
  value,
  maxValue,
  color,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className="font-medium text-gray-900">{value} kW</span>
    </div>
    <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
      <motion.div
        className={`h-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${(value / maxValue) * 100}%` }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </div>
  </div>
)

interface EVInfoBoxProps {
  vehicle: Vehicle;
}

export default function EVInfoBox({ vehicle }: EVInfoBoxProps) {
  if (vehicle.fuelType !== 'Elektro') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-b md:border-b-0 md:border-r border-gray-200">
          <InfoBox title="Batterie & Reichweite" icon={<Battery className="w-6 h-6 text-blue-500" />}>
            <div className="space-y-2">
              <InfoItem label="Reichweite (WLTP)" value={`${vehicle.range || 'N/A'} km`} />
              <InfoItem label="Batteriekapazität" value={`${vehicle.batteryCapacity || 'N/A'} kWh`} />
              <InfoItem label="Energieverbrauch" value={`${vehicle.energyConsumption || 'N/A'} kWh/100 km`} />
            </div>
          </InfoBox>
        </div>

        <div>
          <InfoBox title="Laden & Ladegeschwindigkeit" icon={<Zap className="w-6 h-6 text-green-500" />}>
            <div className="space-y-1">
              <ChargingSpeedBar
                label="Max. AC-Ladeleistung"
                value={vehicle.maxACChargingPower ?? 0}
                maxValue={22}
                color="bg-blue-500"
              />
              <ChargingSpeedBar
                label="Max. DC-Ladeleistung"
                value={vehicle.maxDCChargingPower ?? 0}
                maxValue={300}
                color="bg-green-500"
              />
            </div>
          </InfoBox>
        </div>
      </div>
    </div>
  )
}
