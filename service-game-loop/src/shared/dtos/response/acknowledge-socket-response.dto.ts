// Represents the acknowledge response in WebSocket communication.
export class AcknowledgeSocketResponseDTO {
  success: boolean;

  // The name of the event associated with the acknowledge.
  event: string;

  // The data associated with the acknowledge event.
  data: any;

  message: string;
}
