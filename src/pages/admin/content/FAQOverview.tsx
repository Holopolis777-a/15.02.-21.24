import React, { useState } from 'react';
import { useFAQs } from '../../../hooks/useFAQs';
import FAQFilters from './components/FAQFilters';
import FAQTable from './components/FAQTable';
import { FAQ } from '../../../types/faq';

const FAQOverview = () => {
  const { faqs, isLoading, error } = useFAQs();
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all',
    target: 'all'
  });

  const filteredFAQs = faqs.filter((faq: FAQ) => {
    if (filters.search && !faq.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.target !== 'all' && !faq.targets.includes(filters.target)) {
      return false;
    }
    // Add more filter logic as needed
    return true;
  });

  return (
    <div className="space-y-6">
      <FAQFilters filters={filters} onChange={setFilters} />
      <FAQTable faqs={filteredFAQs} isLoading={isLoading} error={error} />
    </div>
  );
};

export default FAQOverview;