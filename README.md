# Headlane stock extractor

## How to deploy this service

This application is developed using the Serverless Framework, so a couple of libraries should be in place before deploying it to the cloud.

### Prepare your environment

#### Prerequisites

* **NodeJS** and **NPM** installed on your computer
* **AWS CLI** with your credentials configured (see below)
* **Serverless Framework binary** installed on your computer globally

#### 1. NodeJS & NPM

Make sure you have NodeJS and NPM installed in your system. If not, please install it according to your OS.

#### 2. Install serverless via NPM

To install serverless binary to your system, just run the following command in your terminal.

`npm install serverless -g`

#### 3. Set up your AWS credentials

You can set your AWS credentials to environment variables by running the following two commands below

```shell
export AWS_ACCESS_KEY_ID=<your-key-here>
export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
```

Or by using more permanent solution - create a profile in your AWS CLI.
More information you can see [here](https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md#using-aws-profiles).

#### 4. Configure .env

Rename `.env.sample` file to `.env` and set all values in it. You must remove explanatory text with `***` in front of it

### Deploy the service

Before continuing, you need to have all project's dependencies installed. For this, run the following in your terminal:

`npm ci`

The Serverless Framework has out-of-the-box deployment system that works on top of CloudFormation, so to deploy your app you just need to run one single CLI command:

`sls deploy`

By default, it deploys your service in `dev` environment, so to deploy to the production environment you can add `--stage` option, so the command will look like this:

`sls deploy --stage prod`

As an output of this command you will se the summary of your service, including:

* The name of the CloudFormation stack
* Region
* Api keys for your service
* All endpoints registered in the service
* List of lambda functions

#### Request an SSL certificate via Amazon ACM

Before attaching a domain, you need to request a certificate via [ACM](https://eu-west-2.console.aws.amazon.com/acm/home?region=eu-west-2#/)

Since your domain is hosted on Route53, the easiest option to validate your domain ownership using DNS records (ACM will offer you export required records in one click).

#### Attach a domain to the API Gateway

Go to [API Gateway Custom Domains Dashboard](https://eu-west-2.console.aws.amazon.com/apigateway/main/publish/domain-names?region=eu-west-2) and create a new domain.

On the creation page:

* In the domain name field specify a domain you want to attach (for example, api.headlane.co.uk)
* Minimum TLS version - leave by default (TLS 1.2)
* Endpoint type - leave by default (Regional)
* ACM Certificate - select the cert you created previously
* Hit the "Create domain name" button

After a domain is created, you will be redirected to the domain details.
Please copy **API Gateway domain name** value, it will be required to create a CNAME in the Route53.

**Next we need to map our custom domain to our API Gateway.**

Go to the **API Mappings** tab and click **Configure API mappings** -> **Create new mapping** buttons.

Select an API and a `prod` stage, leave **path** empty if you want the API Gateway to be accessible on domains root.

**The last step - create CNAME record in the Route53 hosted zone**

Go to Route53 dashboard and open the needed hosted zone (headlane.co.uk in your case). Click **Create record** button and select **Simple routing**, then click **Define simple record**.

Then, in the wizard:

* Record name - specify the needed subdomain (`api` in your case)
* Value/Route traffic to - Alias to API Gateway API
* Choose the right region
* Choose the right endpoint (should be the same as **API Gateway domain name** value you copied earlier).

**NOTE**: Your record name should be exact same as you defined in API Gateway dashboard, otherwise endpoints list will be empty!

🎉 Voilà, your service should now be accessible on your own domain! 