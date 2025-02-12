import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuthStore } from '../store/authStore';
import { BrokerCommissionData } from '../types/broker';

export const useBrokerCommission = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commissionData, setCommissionData] = useState<BrokerCommissionData | null>(null);

  const fetchCommissionData = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const brokerDoc = await getDoc(doc(db, 'brokers', user.email));
      if (!brokerDoc.exists()) {
        throw new Error('Broker nicht gefunden');
      }

      const brokerData = brokerDoc.data();
      const hasSubBrokers = brokerData.subBrokerCommissions && Object.keys(brokerData.subBrokerCommissions || {}).length > 0;
      
      setCommissionData({
        brokerId: user.id,
        parentBrokerId: brokerData.parentBrokerId,
        commissionPerVehicle: brokerData.commissionPerVehicle || 0,
        availableCommission: hasSubBrokers ? (brokerData.availableCommission || 0) : (brokerData.commissionPerVehicle || 0),
        originalCommission: brokerData.commissionPerVehicle || 0,
        subBrokerCommissions: brokerData.subBrokerCommissions || {}
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Provisionsdaten');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCommission = async (subBrokerId: string, newCommission: number) => {
    if (!user?.email || !commissionData) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get total distributed commission
      const totalDistributed = Object.values(commissionData.subBrokerCommissions).reduce((sum, commission) => sum + commission, 0);
      
      // Calculate how much more commission we're trying to distribute
      const currentSubCommission = commissionData.subBrokerCommissions[subBrokerId] || 0;
      const additionalCommission = newCommission - currentSubCommission;
      
      // Check if we have enough commission to distribute
      const remainingCommission = commissionData.originalCommission - totalDistributed;
      if (remainingCommission < additionalCommission) {
        throw new Error('Nicht genügend verfügbare Provision');
      }

      // Update commission data
      const updatedCommissionData = {
        ...commissionData,
        availableCommission: remainingCommission - additionalCommission,
        subBrokerCommissions: {
          ...commissionData.subBrokerCommissions,
          [subBrokerId]: newCommission
        }
      };

      // Update in Firestore
      await updateDoc(doc(db, 'brokers', user.email), {
        availableCommission: updatedCommissionData.availableCommission,
        subBrokerCommissions: updatedCommissionData.subBrokerCommissions,
        originalCommission: commissionData.originalCommission // Ensure original commission is saved
      });

      setCommissionData(updatedCommissionData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Aktualisieren der Provision');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissionData();
  }, [user?.email]);

  return {
    commissionData,
    isLoading,
    error,
    updateCommission,
    refreshCommissionData: fetchCommissionData
  };
};
