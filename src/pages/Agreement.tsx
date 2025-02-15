import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface Agreement {
  id: number;
  content: string;
  createdAt: string;
  parties: {
    name: string;
    hasAgreed: boolean;
  }[];
}

const Agreement = () => {
  const [newAgreement, setNewAgreement] = useState("");
  const [agreements, setAgreements] = useState<Agreement[]>([
    {
      id: 1,
      content: "We promise to have a date night every weekend",
      createdAt: "2024-02-14",
      parties: [
        { name: "John", hasAgreed: true },
        { name: "Jane", hasAgreed: false },
      ],
    },
    {
      id: 2,
      content: "We will always communicate openly and honestly",
      createdAt: "2024-02-14",
      parties: [
        { name: "John", hasAgreed: true },
        { name: "Jane", hasAgreed: true },
      ],
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgreement.trim()) {
      toast.error("Please enter an agreement");
      return;
    }

    const userName = sessionStorage.getItem("userName");
    if (!userName) {
      toast.error("Please login first");
      return;
    }

    const newAgreementObj: Agreement = {
      id: agreements.length + 1,
      content: newAgreement.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      parties: [
        { name: userName, hasAgreed: true },
        { name: "Partner", hasAgreed: false },
      ],
    };

    setAgreements([...agreements, newAgreementObj]);
    setNewAgreement("");
    toast.success("Agreement created successfully ❤️");
  };

  const toggleAgreement = (agreementId: number, partyName: string) => {
    setAgreements(agreements.map(agreement => {
      if (agreement.id === agreementId) {
        return {
          ...agreement,
          parties: agreement.parties.map(party => {
            if (party.name === partyName) {
              return { ...party, hasAgreed: !party.hasAgreed };
            }
            return party;
          }),
        };
      }
      return agreement;
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/30 to-secondary/30 py-20">
      <div className="container mx-auto px-4">
        <h1 className="font-playfair text-4xl font-bold text-center text-gray-900 mb-8 animate-fadeIn">
          Love Agreement
        </h1>

        {/* New Agreement Form */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fadeIn opacity-0" 
             style={{ animationDelay: "200ms" }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-playfair text-lg font-medium text-gray-900">
                Create New Agreement
              </label>
              <Textarea
                placeholder="Write your agreement here..."
                value={newAgreement}
                onChange={(e) => setNewAgreement(e.target.value)}
                className="min-h-[100px] font-inter"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-love-500 hover:bg-love-600 text-white font-medium py-2 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Create Agreement
            </Button>
          </form>
        </div>

        {/* Existing Agreements */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 animate-fadeIn opacity-0"
             style={{ animationDelay: "400ms" }}>
          <h2 className="font-playfair text-2xl font-semibold text-gray-900 mb-6">
            Existing Agreements
          </h2>
          
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-playfair">Agreement</TableHead>
                  <TableHead className="w-32 text-center font-playfair">Date</TableHead>
                  <TableHead className="w-48 text-center font-playfair">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agreements.map((agreement) => (
                  <TableRow key={agreement.id}>
                    <TableCell className="font-medium">{agreement.content}</TableCell>
                    <TableCell className="text-center">{agreement.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-4">
                        {agreement.parties.map((party, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Checkbox
                              checked={party.hasAgreed}
                              onCheckedChange={() => toggleAgreement(agreement.id, party.name)}
                              className={`h-5 w-5 ${
                                party.hasAgreed ? "bg-green-500 border-green-500" : ""
                              }`}
                            />
                            <span className="text-sm font-medium">
                              {party.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agreement;
