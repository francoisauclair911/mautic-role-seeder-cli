import axios, { Axios } from "axios";
import chalk from "chalk";

class Mautic {
  constructor({ baseUrl, clientId, clientSecret }) {
    this.baseUrl = baseUrl;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.mautic = new Axios({
      ...axios.defaults,
      baseURL: this.baseUrl,
      headers: { "Content-Type": "application/json" },
    });
  }

  async authorize() {
    console.log(chalk.blue("Authorizing API Client"));
    const {
      data: { access_token: accessToken },
    } = await this.mautic.post(`/oauth/v2/token`, {
      grant_type: "client_credentials",
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    this.mautic.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
    console.log(chalk.green("Authorized"));
  }

  async listRoles() {
    console.log(chalk.blue("Fetching existing roles"));

    const {
      data: { roles },
    } = await this.mautic.get("/api/roles");
    return roles;
  }

  async getRole(id) {
    console.log(chalk.blue("Getting role ", id));

    const {
      data: { role },
    } = await this.mautic.get(`/api/roles/${id}`);

    return role;
  }

  async createRole(payload) {
    console.log(chalk.blue(`Creating role:  ${payload.name}`));

    const {
      data: { role },
    } = await this.mautic.post(`/api/roles/new`, {
      ...payload,
    });
    console.log(chalk.green(`Created with ID: ${role.id}`));

    return role;
  }

  async deleteRole(id) {
    console.log(chalk.red("Deleting role ", id));
    return await this.mautic.delete(`/api/roles/${id}/delete`);
  }
  async deleteAllRoles() {
    console.log(chalk.red("Deleting all Roles except default"));
    for (const role of await this.listRoles()) {
      if (role.id !== 1) {
        await this.deleteRole(role.id);
      }
    }
  }
}
export default Mautic;
