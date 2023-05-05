using Barrway.DTO.Common;
using Barrway.Service.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Barrway.Service.Repository
{
    public class MasterService
    {
        private readonly ISqlFunction sqlFunction;

        public MasterService(ISqlFunction sqlFunction)
        {
            this.sqlFunction = sqlFunction;
        }

        //public async Task<AddUpdateDelete> GetLocationMasterList()
        //{

        //}
    }
}
