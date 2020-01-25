import {Inject, Logger, Injectable} from '@nestjs/common';
import {cloneDeep, pickBy, identity} from 'lodash';

@Injectable()
export class Neo4jService {

	constructor(@Inject('Neo4jProvider') private readonly neo4j) {}

	public async executeQuery(query: string, params?: any) {

		if (!params) {
			return await this.cipher(query);
		} else {
			const result = await this.parameterizedCipher(query, params);
			return result;
		}
	}

	private parameterizedCipher(query: string, params) {
		const session = this.neo4j.session();
		return session.run(query, params).then((result) => {
			session.close();
			return result.records;
		});
	}

	private cipher(query: string) {
		const session = this.neo4j.session();
		return session.run(query).then((result) => {
			session.close();
			return result.records;
		});
	}

	private merge(data: any) {
		const session = this.neo4j.session();
		const statement = `
			MERGE (t:YOUR_TYPE {your_id: $your_id})
		    ON CREATE SET t = $props
		    ON MATCH SET t += $props
    `;
		session.run(statement, { your_id: data.your_id, props: pickBy(data, identity) })
			.then(() => session.close())
			.catch((err) => console.log(err));
	}

	private replace(data: any) {
		const session = this.neo4j.session();
		const statement = `
			MATCH (t:YOUR_TYPE {your_id: $your_id})
			SET t = $props
`;

		session.run(statement, { your_id: data.your_id, props: pickBy(data, identity) })
			.then(() => session.close())
			.catch((err) => console.log(err));
	}
}
