'use client';

import { useState } from 'react';

interface TicketEntry {
  id: string;
  date: string;
  issue: string;
  details: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved';
  submittedBy: string;
}

interface RaiseTicketProps {
  userRole: string;
  currentUser: string;
  onLogAction: (action: string, details: string, module?: string) => void;
}

export default function RaiseTicket({ userRole, currentUser, onLogAction }: RaiseTicketProps) {
  const [ticketFormData, setTicketFormData] = useState({
    issue: '',
    details: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const [submittedTickets, setSubmittedTickets] = useState<TicketEntry[]>([
    {
      id: '1',
      date: '2024-01-29',
      issue: 'Printer not working',
      details: 'Office printer showing paper jam error even after clearing paper. Unable to print important documents.',
      priority: 'high',
      status: 'open',
      submittedBy: currentUser
    },
    {
      id: '2',
      date: '2024-01-28',
      issue: 'AC making noise',
      details: 'Air conditioner in conference room making unusual rattling noise. Temperature control seems fine but noise is disturbing meetings.',
      priority: 'medium',
      status: 'in-progress',
      submittedBy: currentUser
    }
  ]);

  const handleSubmitTicket = () => {
    if (!ticketFormData.issue || !ticketFormData.details) {
      alert('Please fill in all required fields');
      return;
    }

    if (ticketFormData.issue.length < 5) {
      alert('Issue summary must be at least 5 characters long');
      return;
    }

    if (ticketFormData.details.length < 10) {
      alert('Details must be at least 10 characters long');
      return;
    }

    const newTicket: TicketEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      issue: ticketFormData.issue,
      details: ticketFormData.details,
      priority: ticketFormData.priority,
      status: 'open',
      submittedBy: currentUser
    };

    setSubmittedTickets([newTicket, ...submittedTickets]);
    onLogAction('Submit Ticket', `Submitted new ${ticketFormData.priority} priority ticket: ${ticketFormData.issue}`, 'Tickets');
    
    setTicketFormData({
      issue: '',
      details: '',
      priority: 'medium'
    });
    
    alert('Ticket submitted successfully! Your request has been logged and will be addressed soon.');
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'open': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-orange-100 text-orange-800',
      'resolved': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      'open': 'ri-time-line',
      'in-progress': 'ri-loader-4-line',
      'resolved': 'ri-check-line'
    };
    return icons[status as keyof typeof icons] || 'ri-question-line';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Raise a Ticket</h1>
            <p className="text-gray-600">Submit maintenance requests and track their status</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Submit New Ticket Form */}
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Submit New Ticket</h2>
                <p className="text-gray-600">Describe the issue you're experiencing and we'll address it as soon as possible.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Date</label>
                    <input
                      type="text"
                      value={new Date().toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Summary *</label>
                    <input
                      type="text"
                      value={ticketFormData.issue}
                      onChange={(e) => setTicketFormData({...ticketFormData, issue: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description of the issue..."
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 mt-1">{ticketFormData.issue.length}/100 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Explain in Detail *</label>
                    <textarea
                      value={ticketFormData.details}
                      onChange={(e) => setTicketFormData({...ticketFormData, details: e.target.value})}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Provide detailed information about the issue, including when it started, what actions led to it, and any error messages..."
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">{ticketFormData.details.length}/500 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Priority Level *</label>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value="low"
                          checked={ticketFormData.priority === 'low'}
                          onChange={(e) => setTicketFormData({...ticketFormData, priority: e.target.value as 'low' | 'medium' | 'high'})}
                          className="mr-3"
                        />
                        <div>
                          <span className="font-medium text-green-700">Low Priority</span>
                          <p className="text-sm text-gray-600">Not urgent, can be addressed during regular maintenance</p>
                        </div>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value="medium"
                          checked={ticketFormData.priority === 'medium'}
                          onChange={(e) => setTicketFormData({...ticketFormData, priority: e.target.value as 'low' | 'medium' | 'high'})}
                          className="mr-3"
                        />
                        <div>
                          <span className="font-medium text-yellow-700">Medium Priority</span>
                          <p className="text-sm text-gray-600">Affects daily operations but has workarounds</p>
                        </div>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="priority"
                          value="high"
                          checked={ticketFormData.priority === 'high'}
                          onChange={(e) => setTicketFormData({...ticketFormData, priority: e.target.value as 'low' | 'medium' | 'high'})}
                          className="mr-3"
                        />
                        <div>
                          <span className="font-medium text-red-700">High Priority</span>
                          <p className="text-sm text-gray-600">Critical issue requiring immediate attention</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleSubmitTicket}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer whitespace-nowrap font-medium flex items-center justify-center gap-2"
                    >
                      <i className="ri-send-plane-line w-4 h-4 flex items-center justify-center"></i>
                      Submit Ticket
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* My Tickets */}
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">My Tickets</h2>
                <p className="text-gray-600">Track the status of your submitted tickets</p>
              </div>

              <div className="space-y-4">
                {submittedTickets.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <i className="ri-ticket-line w-12 h-12 flex items-center justify-center text-gray-400 mx-auto mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets submitted</h3>
                    <p className="text-gray-500">You haven't submitted any tickets yet.</p>
                  </div>
                ) : (
                  submittedTickets.map(ticket => (
                    <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{ticket.issue}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.details}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <i className="ri-calendar-line w-3 h-3 flex items-center justify-center"></i>
                              {new Date(ticket.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <i className="ri-user-line w-3 h-3 flex items-center justify-center"></i>
                              {ticket.submittedBy}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                            <i className={`${getStatusIcon(ticket.status)} w-3 h-3 flex items-center justify-center`}></i>
                            {ticket.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      {ticket.status === 'resolved' && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-sm text-green-700">
                            <i className="ri-check-double-line w-4 h-4 flex items-center justify-center"></i>
                            <span className="font-medium">Ticket resolved</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-blue-900">
                    {submittedTickets.filter(t => t.status === 'open').length}
                  </div>
                  <div className="text-xs text-blue-700">Open</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-orange-900">
                    {submittedTickets.filter(t => t.status === 'in-progress').length}
                  </div>
                  <div className="text-xs text-orange-700">In Progress</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-900">
                    {submittedTickets.filter(t => t.status === 'resolved').length}
                  </div>
                  <div className="text-xs text-green-700">Resolved</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <i className="ri-information-line w-5 h-5 flex items-center justify-center text-blue-600 mt-0.5"></i>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How it works:</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Submit tickets for any maintenance issues or requests</li>
                <li>• Set appropriate priority based on urgency</li>
                <li>• Track ticket status and receive updates</li>
                <li>• Maintenance team will address tickets based on priority</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}