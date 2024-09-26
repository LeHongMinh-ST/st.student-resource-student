import { AdmissionYear } from '@/types';
import AdmissionYearCard from './AdmissionYearCard';
import EmptyTable from '@/components/CommonDataTable/EmptyTable';
import AdmissionYearCardSkeleton from './skeletons/AdmissionYearCardSkeleton';

interface AdmissionYearListProps {
  admissionYears: AdmissionYear[];
  onSelect: (admissionYear: AdmissionYear) => void;
  fetching?: boolean;
}

const AdmissionYearList = ({
  admissionYears,
  onSelect,
  fetching = false,
}: AdmissionYearListProps) => {
  if (fetching) {
    return <AdmissionYearCardSkeleton />;
  }

  return (
    <>
      {admissionYears.length > 0 ? (
        admissionYears.map((item) => (
          <AdmissionYearCard key={item.admission_year} admissionYear={item} onSelect={onSelect} />
        ))
      ) : (
        <EmptyTable />
      )}
    </>
  );
};

export default AdmissionYearList;
