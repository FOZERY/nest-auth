export interface EventsPublisher {
	publish(topic: string, events: Array<any>): void;
	publishWithKey(topic: string, key: string, events: Array<any>): void;
}
