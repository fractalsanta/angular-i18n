using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Mx.Web.UI.Areas.Forecasting.Api
{
	public class CharacteristicCodeController : ApiController
	{
		// GET api/<controller>
		public IEnumerable<String> Get()
		{
			return new string[] { "Characteristic Code 1", "Characteristic Code 2" };
		}

		// GET api/<controller>/5
		public string Get(Int64 id)
		{
			return "Characteristic Code " + id;
		}

		// POST api/<controller>
		public void Post([FromBody]String value)
		{
		}

		// PUT api/<controller>/5
		public void Put(int id, [FromBody]String value)
		{
		}

		// DELETE api/<controller>/5
		public void Delete(Int64 id)
		{
		}
	}
}