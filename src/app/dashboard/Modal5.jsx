// components/Modal5.jsx
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem, RadioGroup, Radio } from "@nextui-org/react";

export default function Modal5({ selectedDate }) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [canAnswer, setCanAnswer] = useState(true);
  const [error, setError] = useState(null);

  const fetchDailyQuestions = async () => {
    try {
      const response = await fetch('/api/user/daily-questions');
      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions');
    }
  };

  useEffect(() => {
    // Inside Modal5.jsx, update the checkAnswerStatus function

const checkAnswerStatus = async () => {
  try {
    if (!selectedDate) {
      setError('No date selected');
      setCanAnswer(false);
      return;
    }

    // Validate date format
    const validDate = new Date(selectedDate);
    if (isNaN(validDate.getTime())) {
      setError('Invalid date format');
      setCanAnswer(false);
      return;
    }

    const response = await fetch(`/api/user/check-daily-answer?date=${selectedDate}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || typeof data.hasAnswered === 'undefined') {
      throw new Error('Invalid response format');
    }

    setCanAnswer(!data.hasAnswered);
    setError(null);
    
  } catch (err) {
    const errorMessage = err.message || 'Failed to verify answer status';
    console.error('Error checking answer status:', errorMessage);
    setError(errorMessage);
    setCanAnswer(false);
  }
};

    if (isOpen) {
      checkAnswerStatus();
      fetchDailyQuestions();
    }
  }, [isOpen, selectedDate]);

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/save-daily-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate || new Date().toISOString(),
          answers
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save answers');
      }

      onClose();
      setAnswers({});
      // You might want to add a success callback here
    } catch (error) {
      console.error('Error saving answers:', error);
      setError('Failed to save answers');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (question, index) => {
    if (question.includes("hours") || question.includes("How many")) {
      return (
        <Input
          type="number"
          min="0"
          max="24"
          label={question}
          value={answers[index] || ''}
          onChange={(e) => handleAnswerChange(index, parseInt(e.target.value))}
        />
      );
    } else if (question.includes("Scale 1-10") || question.includes("rate")) {
      return (
        <Input
          type="number"
          min="1"
          max="10"
          label={question}
          value={answers[index] || ''}
          onChange={(e) => handleAnswerChange(index, parseInt(e.target.value))}
        />
      );
    } else if (question.includes("water")) {
      return (
        <Select
          label={question}
          value={answers[index] || ''}
          onChange={(e) => handleAnswerChange(index, e.target.value)}
        >
          <SelectItem value="less2">Less than 2 glasses</SelectItem>
          <SelectItem value="2to4">2-4 glasses</SelectItem>
          <SelectItem value="4to6">4-6 glasses</SelectItem>
          <SelectItem value="6to8">6-8 glasses</SelectItem>
          <SelectItem value="more8">More than 8 glasses</SelectItem>
        </Select>
      );
    } else {
      return (
        <RadioGroup
          label={question}
          value={answers[index] || ''}
          onValueChange={(value) => handleAnswerChange(index, value)}
        >
          <div className="flex gap-6">
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
            <Radio value="somewhat">Somewhat</Radio>
          </div>
        </RadioGroup>
      );
    }
  };

  return (
    <>
      <Button  
        variant="shadow" 
        size="md"
        color="success" 
        onPress={onOpen}
        className="capitalize text-white"
      >
        Answer Daily Questions
      </Button>
      <Modal 
        backdrop="blur" 
        isOpen={isOpen} 
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b">
                Daily Health Check
                {selectedDate && 
                  <span className="text-sm text-gray-500">
                    For: {new Date(selectedDate).toLocaleDateString()}
                  </span>
                }
              </ModalHeader>
              <ModalBody className="max-h-[60vh] overflow-y-auto">
                {error && (
                  <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
                    {error}
                  </div>
                )}
                <div className="space-y-6 py-2">
                  {questions.map((question, index) => (
                    <div key={index} className="space-y-2">
                      {renderQuestion(question, index)}
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter className="border-t">
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleSubmit}
                  isLoading={loading}
                  isDisabled={!canAnswer}
                >
                  {canAnswer ? 'Submit Answers' : 'Already Answered'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}