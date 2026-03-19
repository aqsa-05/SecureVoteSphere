import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Candidate {
  id: number;
  name: string;
  party: string | null;
  position: string;
}

interface BallotItemProps {
  position: string;
  candidates: Candidate[];
  selectedCandidateId?: number;
  onVoteChange: (position: string, candidateId: number) => void;
}

export default function BallotItem({
  position,
  candidates,
  selectedCandidateId,
  onVoteChange,
}: BallotItemProps) {
  return (
    <section className="bg-white shadow-sm rounded-lg overflow-hidden mt-6">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-blue-900">{position}</h2>
            <p className="text-sm text-blue-700">Select one candidate</p>
          </div>
          <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center text-blue-800 shadow-sm border border-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=""><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path></svg>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <RadioGroup
          value={selectedCandidateId?.toString()}
          onValueChange={(value) => onVoteChange(position, parseInt(value, 10))}
          className="space-y-4"
        >
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className={`border rounded-lg p-4 transition-all cursor-pointer ${
                selectedCandidateId === candidate.id 
                  ? "border-blue-400 bg-blue-50 shadow-md" 
                  : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start">
                <div className="pr-4">
                  <RadioGroupItem
                    value={candidate.id.toString()}
                    id={`candidate-${candidate.id}`}
                    className="mt-1"
                  />
                </div>
                <Label
                  htmlFor={`candidate-${candidate.id}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <span className="block text-base font-medium text-gray-900">
                        {candidate.name}
                      </span>
                      {candidate.party && (
                        <span className={`block text-sm ${
                          candidate.party.toLowerCase().includes('democrat') 
                            ? 'text-blue-600' 
                            : candidate.party.toLowerCase().includes('republican')
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}>
                          {candidate.party}
                        </span>
                      )}
                    </div>
                    
                    {selectedCandidateId === candidate.id && (
                      <div className="mt-2 sm:mt-0 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        Selected
                      </div>
                    )}
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </div>
    </section>
  );
}
